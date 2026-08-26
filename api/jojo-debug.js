const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const REST = 'https://discord.com/api/v10';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const guildId = '1542084330065498174';
  const results = [];

  try {
    const t1 = Date.now();
    const botRes = await fetch(`${REST}/users/@me`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const bot = await botRes.json();
    results.push(`Bot user: ${bot.username} (${Date.now() - t1}ms)`);

    const t2 = Date.now();
    const rolesRes = await fetch(`${REST}/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const roles = await rolesRes.json();
    results.push(`Guild roles: ${Array.isArray(roles) ? roles.length : 'error'} (${Date.now() - t2}ms)`);

    const SP_ID = '1542117577998733402';
    const t3 = Date.now();
    const chRes = await fetch(`${REST}/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const channels = await chRes.json();
    const missingPerms = [];
    if (Array.isArray(channels)) {
      for (const ch of channels) {
        const spOverwrite = (ch.permission_overwrites || []).find(o => o.id === SP_ID);
        if (!spOverwrite) {
          missingPerms.push(`${ch.name}(${ch.id})`);
        }
      }
      results.push(`Channels: ${channels.length} total, missing SP perms on: ${missingPerms.length > 0 ? missingPerms.join(', ') : 'none'} (${Date.now() - t3}ms)`);
    } else {
      results.push(`Channels error: ${JSON.stringify(channels).slice(0, 200)}`);
    }

    return res.status(200).json({ results });
  } catch (e) {
    return res.status(500).json({ error: e.message, results });
  }
};
