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
    // Test 1: Get bot user
    const t1 = Date.now();
    const botRes = await fetch(`${REST}/users/@me`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const bot = await botRes.json();
    results.push(`Bot user: ${bot.username}#${bot.discriminator} (${Date.now() - t1}ms)`);

    // Test 2: Get guild roles
    const t2 = Date.now();
    const rolesRes = await fetch(`${REST}/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const roles = await rolesRes.json();
    results.push(`Guild roles: ${Array.isArray(roles) ? roles.length : JSON.stringify(roles).slice(0,100)} (${Date.now() - t2}ms)`);

    // Test 3: Create a single role
    const t3 = Date.now();
    const createRes = await fetch(`${REST}/guilds/${guildId}/roles`, {
      method: 'POST',
      headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '_debug_test', color: 0xFF0000, permissions: '0', hoist: false, mentionable: false })
    });
    const createText = await createRes.text();
    results.push(`Create role: ${createRes.status} (${Date.now() - t3}ms)`);
    if (createRes.ok) {
      const created = JSON.parse(createText);
      results.push(`Created role ID: ${created.id}`);

      // Test 4: Delete the test role
      const t4 = Date.now();
      const delRes = await fetch(`${REST}/guilds/${guildId}/roles/${created.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bot ${BOT_TOKEN}` }
      });
      results.push(`Delete role: ${delRes.status} (${Date.now() - t4}ms)`);
    } else {
      results.push(`Error: ${createText.slice(0, 200)}`);
    }

    return res.status(200).json({ results });
  } catch (e) {
    return res.status(500).json({ error: e.message, results });
  }
};
