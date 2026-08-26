const BOT_TOKEN = process.env.STAR_PLATINUM_TOKEN || '';
const SECRET = process.env.BUILDER_SECRET || 'jojo-build-2026';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { channel_ids, secret } = req.body || {};
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

    const channels = channel_ids && channel_ids.length ? channel_ids : null;

    if (!channels) {
      return res.status(400).json({ error: 'No channel IDs provided' });
    }

    for (const chId of channels) {
      try {
        let before = null;
        let deleted = 0;

        // Fetch up to 500 messages per channel
        for (let i = 0; i < 10; i++) {
          const url = `https://discord.com/api/v10/channels/${chId}/messages?limit=100${before ? '&before=' + before : ''}`;
          const msgRes = await fetch(url, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
          });
          if (!msgRes.ok) {
            const err = await msgRes.text();
            log.push(`  ${chId}: fetch failed ${msgRes.status} ${err.slice(0, 100)}`);
            break;
          }
          const messages = await msgRes.json();
          if (!messages.length) break;

          // Filter to bot-only messages
          const botMsgs = messages.filter(m => m.author && m.author.id === botUserId);
          if (botMsgs.length === 0) {
            before = messages[messages.length - 1].id;
            continue;
          }

          // Bulk delete (up to 100 at a time, messages must be <14 days old)
          const ids = botMsgs.map(m => m.id);
          const bulkRes = await fetch(`https://discord.com/api/v10/channels/${chId}/messages/bulk-delete`, {
            method: 'POST',
            headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: ids })
          });

          if (bulkRes.ok) {
            deleted += ids.length;
          } else {
            // Fall back to individual deletes
            for (const msgId of ids) {
              const delRes = await fetch(`https://discord.com/api/v10/channels/${chId}/messages/${msgId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bot ${BOT_TOKEN}` }
              });
              if (delRes.ok || delRes.status === 204) deleted++;
              await new Promise(r => setTimeout(r, 100));
            }
          }

          before = messages[messages.length - 1].id;
          await new Promise(r => setTimeout(r, 300));
        }

        totalDeleted += deleted;
        log.push(`  ${chId}: deleted ${deleted} bot messages`);
      } catch (e) {
        log.push(`  ${chId}: error ${e.message}`);
      }
    }

    return res.status(200).json({ success: true, total_deleted: totalDeleted, log });
  } catch (e) {
    return res.status(500).json({ error: e.message, log, total_deleted: totalDeleted });
  }
};
