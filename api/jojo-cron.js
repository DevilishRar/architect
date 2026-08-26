const { kv } = require('@vercel/kv');
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const CRON_SECRET = process.env.CRON_SECRET || '';
const GUILD_ID = process.env.DISCORD_GUILD_ID || '';

function getHeaders() {
  return { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' };
}

async function api(method, path, body) {
  const opts = { method, headers: getHeaders() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://discord.com/api/v10${path}`, opts);
  if (res.status === 204) return null;
  if (!res.ok) { const e = await res.text(); throw new Error(`${res.status}: ${e}`); }
  return res.json();
}

async function sendEmbed(channelId, embed) {
  try {
    await api('POST', `/channels/${channelId}/messages`, { embeds: [embed] });
    return true;
  } catch (e) {
    console.error(`Failed to send to ${channelId}:`, e.message);
    return false;
  }
}

const GIFS = {
  welcome: 'https://media.tenor.com/0LLm3nc6808AAAAM/jojo-bizarre-adventure.gif',
  goodbye: 'https://media.tenor.com/xeJTJmzWxAEAAAAM/jjba-goodnight-dio-goodnight.gif',
};

const COLORS = { gold: 0xFFD700, dark: 0x2C2F33 };

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (CRON_SECRET) {
    const authHeader = req.headers.authorization || '';
    const queryToken = req.query?.token || '';
    if (authHeader !== `Bearer ${CRON_SECRET}` && queryToken !== CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (!BOT_TOKEN) return res.status(500).json({ error: 'No bot token' });
  if (!GUILD_ID) return res.status(500).json({ error: 'No guild ID' });

  try {
    const guild = await api('GET', `/guilds/${GUILD_ID}`);
    const allMembers = [];
    let after = '0';
    while (true) {
      const batch = await api('GET', `/guilds/${GUILD_ID}/members?limit=1000&after=${after}`);
      if (!batch || batch.length === 0) break;
      allMembers.push(...batch);
      if (batch.length < 1000) break;
      after = batch[batch.length - 1].user.id;
    }

    const currentMap = {};
    for (const m of allMembers) {
      if (!m.user.bot) {
        currentMap[m.user.id] = {
          id: m.user.id,
          tag: m.user.username + (m.user.discriminator === '0' ? '' : '#' + m.user.discriminator),
          joined: m.joined_at,
        };
      }
    }

    const stored = await kv.get('jojo-members');

    if (!stored) {
      await kv.set('jojo-members', currentMap);
      return res.status(200).json({ success: true, action: 'initialized', count: Object.keys(currentMap).length });
    }

    const storedIds = new Set(Object.keys(stored));
    const currentIds = new Set(Object.keys(currentMap));

    const joined = [];
    for (const [id, member] of Object.entries(currentMap)) {
      if (!storedIds.has(id)) joined.push(member);
    }

    const left = [];
    for (const [id, member] of Object.entries(stored)) {
      if (!currentIds.has(id)) left.push(member);
    }

    let welcomeChannel = null;
    const channels = await api('GET', `/guilds/${GUILD_ID}/channels`);
    for (const ch of channels) {
      if (ch.type === 0 && ch.name.toLowerCase().includes('welcome')) {
        welcomeChannel = ch.id;
        break;
      }
    }

    let welcomeCount = 0;
    for (const member of joined) {
      if (welcomeChannel) {
        const avatar = `https://cdn.discordapp.com/embed/avatars/${parseInt(member.id) % 5}.png`;
        await sendEmbed(welcomeChannel, {
          title: 'Welcome to the Bizarre Adventure!',
          description: `<@${member.id}> has joined the server!\n\n📖 Read the rules in <#${channels.find(c => c.name.includes('rules'))?.id || ''}>\n🎭 Pick your character role in <#${channels.find(c => c.name.includes('role-select'))?.id || ''}>\n💬 Say hi in <#${channels.find(c => c.name.includes('general'))?.id || ''}>`,
          color: COLORS.gold,
          thumbnail: { url: avatar },
          image: { url: GIFS.welcome },
          footer: { text: 'Yare yare daze...' },
          timestamp: new Date().toISOString()
        });
        welcomeCount++;
      }
    }

    let goodbyeCount = 0;
    for (const member of left) {
      if (welcomeChannel) {
        await sendEmbed(welcomeChannel, {
          title: 'Goodbye, friend!',
          description: `**${member.tag}** has left the server.\n\nYare yare daze... We'll miss you.`,
          color: COLORS.dark,
          image: { url: GIFS.goodbye },
          footer: { text: 'Yare yare daze...' },
          timestamp: new Date().toISOString()
        });
        goodbyeCount++;
      }
    }

    await kv.set('jojo-members', currentMap);

    return res.status(200).json({
      success: true,
      total: Object.keys(currentMap).length,
      joined: welcomeCount,
      left: goodbyeCount,
    });

  } catch (e) {
    console.error('Cron error:', e.message);
    return res.status(500).json({ error: e.message });
  }
};
