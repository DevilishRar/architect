const BOT_TOKEN = process.env.STAR_PLATINUM_TOKEN || '';
const BUILDER_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const SECRET = process.env.BUILDER_SECRET || 'jojo-build-2026';
const GUILD_ID = '1542084330065498174';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { secret } = req.body || {};
  if (secret !== SECRET) return res.status(403).json({ error: 'Invalid secret' });

  const log = [];
  let totalDeleted = 0;

  try {
    // Get bot user ID
    const meRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const me = await meRes.json();
    const botUserId = me.id;
    log.push(`Bot user: ${me.username} (${botUserId})`);

    // Fetch all channels from Discord
    const chRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
      headers: { Authorization: `Bot ${BUILDER_TOKEN}` }
    });
    const channels = await chRes.json();

    if (!Array.isArray(channels)) {
      return res.status(500).json({ error: 'Failed to fetch channels', log });
    }

    // Only text channels (type 0)
    const textChannels = channels.filter(ch => ch.type === 0);
    log.push(`Found ${textChannels.length} text channels`);

    for (const ch of textChannels) {
      try {
        let before = null;
        let deleted = 0;

        for (let i = 0; i < 10; i++) {
          const url = `https://discord.com/api/v10/channels/${ch.id}/messages?limit=100${before ? '&before=' + before : ''}`;
          const msgRes = await fetch(url, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
          });
          if (!msgRes.ok) break;
          const messages = await msgRes.json();
          if (!messages.length) break;

          const botMsgs = messages.filter(m => m.author && m.author.id === botUserId);
          if (!botMsgs.length) {
            before = messages[messages.length - 1].id;
            continue;
          }

          const ids = botMsgs.map(m => m.id);
          const bulkRes = await fetch(`https://discord.com/api/v10/channels/${ch.id}/messages/bulk-delete`, {
            method: 'POST',
            headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: ids })
          });

          if (bulkRes.ok) {
            deleted += ids.length;
          } else {
            for (const msgId of ids) {
              await fetch(`https://discord.com/api/v10/channels/${ch.id}/messages/${msgId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bot ${BOT_TOKEN}` }
              });
              deleted++;
              await new Promise(r => setTimeout(r, 100));
            }
          }

          before = messages[messages.length - 1].id;
          await new Promise(r => setTimeout(r, 300));
        }

        if (deleted > 0) {
          totalDeleted += deleted;
          log.push(`  ${ch.name}: deleted ${deleted}`);
        }
      } catch (e) {
        log.push(`  ${ch.name}: error ${e.message}`);
      }
    }

    return res.status(200).json({ success: true, total_deleted: totalDeleted, log });
  } catch (e) {
    return res.status(500).json({ error: e.message, log, total_deleted: totalDeleted });
  }
};
