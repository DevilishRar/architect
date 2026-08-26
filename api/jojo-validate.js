const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const SECRET = 'jojo-validate-2026';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!BOT_TOKEN) return res.status(500).json({ error: 'No bot token' });
  if (!req.body || req.body.secret !== SECRET) return res.status(403).json({ error: 'Bad secret' });

  const guildId = req.body.guild_id;
  if (!guildId) return res.status(400).json({ error: 'No guild_id' });

  try {
    const r = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (r.status === 200) {
      const guild = await r.json();
      return res.status(200).json({
        valid: true,
        name: guild.name,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
        member_count: guild.member_count
      });
    } else if (r.status === 401) {
      return res.status(200).json({ valid: false, error: 'Bot is not in this server or token is invalid' });
    } else if (r.status === 403) {
      return res.status(200).json({ valid: false, error: 'Bot lacks permissions (needs Manage Server)' });
    } else {
      const e = await r.text();
      return res.status(200).json({ valid: false, error: `Discord API error: ${r.status}` });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
