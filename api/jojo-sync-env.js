const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
const PROJECT_ID = 'prj_Z7Xq8EEm6sp8QL0LIFwGqXEjsiTg';
const SECRET = process.env.BUILDER_SECRET || 'jojo-build-2026';
const VERCEL_API = 'https://api.vercel.com';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { env_content, secret } = req.body || {};
  if (secret !== SECRET) return res.status(403).json({ error: 'Invalid secret' });
  if (!env_content) return res.status(400).json({ error: 'No env content provided' });

  const log = [];
  const headers = { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' };

  try {
    // 1. Parse .env content
    const lines = env_content.split('\n');
    const envVars = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.substring(0, eqIdx).trim();
      const value = trimmed.substring(eqIdx + 1).trim();
      if (key && value) envVars.push({ key, value });
    }
    log.push(`Parsed ${envVars.length} env vars from .env file`);

    // 2. Delete all existing env vars
    const listRes = await fetch(`${VERCEL_API}/v9/projects/${PROJECT_ID}/env`, { headers });
    const listData = await listRes.json();
    const existing = listData.envs || [];
    log.push(`Found ${existing.length} existing env vars to delete`);

    let deleted = 0;
    for (const env of existing) {
      const delRes = await fetch(`${VERCEL_API}/v9/projects/${PROJECT_ID}/env/${env.id}`, {
        method: 'DELETE',
        headers
      });
      if (delRes.ok || delRes.status === 204) deleted++;
      await new Promise(r => setTimeout(r, 100));
    }
    log.push(`Deleted ${deleted} env vars`);

    // 3. Create new env vars
    let created = 0;
    let failed = 0;
    for (const { key, value } of envVars) {
      const createRes = await fetch(`${VERCEL_API}/v9/projects/${PROJECT_ID}/env`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          key,
          value,
          type: 'encrypted',
          target: ['production']
        })
      });
      if (createRes.ok) {
        created++;
      } else {
        const err = await createRes.text();
        failed++;
        log.push(`  FAIL: ${key} - ${createRes.status} ${err.slice(0, 100)}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }
    log.push(`Created ${created} env vars (${failed} failed)`);

    return res.status(200).json({ success: true, created, deleted, failed, log });
  } catch (e) {
    return res.status(500).json({ error: e.message, log });
  }
};
