const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const SECRET = 'jojo-register-2026';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!BOT_TOKEN) return res.status(500).json({ error: 'No bot token' });
  if (!req.body || req.body.secret !== SECRET) return res.status(403).json({ error: 'Bad secret' });

  const guildId = req.body.guild_id;
  if (!guildId) return res.status(400).json({ error: 'guild_id required' });

  const headers = { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' };

  const commands = [
    {
      name: 'help',
      description: 'Show all bot commands',
    },
    {
      name: 'roles',
      description: 'List all available character roles',
    },
    {
      name: 'role',
      description: 'Get a character role',
      options: [{
        name: 'character',
        description: 'Character name (e.g. jotaro-kujo, dio, Giorno Giovanna)',
        type: 3,
        required: true,
        autocomplete: true
      }]
    },
    {
      name: 'server',
      description: 'Show server info',
    },
    {
      name: 'avatar',
      description: 'Get a user\'s avatar',
      options: [{
        name: 'user',
        description: 'User to get avatar of',
        type: 6,
        required: false
      }]
    },
    {
      name: '8ball',
      description: 'Ask the Stand Arrow',
      options: [{
        name: 'question',
        description: 'Your question',
        type: 3,
        required: true
      }]
    },
    {
      name: 'poll',
      description: 'Create a yes/no poll',
      options: [{
        name: 'question',
        description: 'Poll question',
        type: 3,
        required: true
      }]
    },
  ];

  try {
    const r = await fetch(`https://discord.com/api/v10/applications/1541032062570598460/guilds/${guildId}/commands`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(commands)
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: `Discord API ${r.status}: ${err}` });
    }

    const result = await r.json();
    return res.status(200).json({ success: true, registered: result.length, commands: result.map(c => c.name) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
