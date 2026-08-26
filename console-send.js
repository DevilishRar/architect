
(async function jojoSendAll() {
  const LOG = [];
  const ERR = [];

  function log(msg) { console.log('%c[JoJo] ' + msg, 'color: #9B59B6;'); LOG.push(msg); }
  function err(msg) { console.error('%c[JoJo] ' + msg, 'color: #E74C3C;'); ERR.push(msg); }

  async function call(path, secret, body) {
    try {
      const payload = body || {};
      if (secret) payload.secret = secret;
      const resp = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (resp.ok && data.success !== false) return data;
      err(path + ': ' + (data.error || resp.status));
      return null;
    } catch (e) {
      err(path + ': ' + e.message);
      return null;
    }
  }

  console.clear();
  console.log('%c╔══════════════════════════════════════╗', 'color: #9B59B6; font-weight: bold;');
  console.log('%c║   🌹 JOJO — Send All Messages        ║', 'color: #9B59B6; font-weight: bold;');
  console.log('%c╚══════════════════════════════════════╝', 'color: #9B59B6; font-weight: bold;');

  let idsRaw = '';
  try { idsRaw = await navigator.clipboard.readText(); } catch {}
  idsRaw = prompt('Paste your channel IDs (from builder .env output):', idsRaw || '');
  if (!idsRaw) { err('No IDs provided. Aborting.'); return; }

  let ids = {};
  try {
    const lines = idsRaw.split('\n').filter(l => l.includes('='));
    lines.forEach(line => {
      const [key, ...val] = line.split('=');
      const k = key.trim().toLowerCase().replace(/_role_id|_channel_id/g, '').replace(/[^a-z0-9]/g, '_');
      ids[k] = val.join('=').trim();
    });
  } catch { err('Could not parse IDs'); return; }

  log('Parsed ' + Object.keys(ids).length + ' IDs');

  log('Sending all messages...');
  const msgs = await call('https://architect-henna-eta.vercel.app/api/jojo-send-messages', 'jojo-send-messages-2026', { ids });
  if (msgs && msgs.log) {
    msgs.log.forEach(l => log('  ' + l));
  }

  console.log('');
  console.log('%c╔══════════════════════════════════════╗', 'color: #9B59B6; font-weight: bold;');
  console.log('%c║   ALL DONE                          ║', 'color: #9B59B6; font-weight: bold;');
  console.log('%c╚══════════════════════════════════════╝', 'color: #9B59B6; font-weight: bold;');
  if (ERR.length) {
    console.log('%cErrors:', 'color: #E74C3C; font-weight: bold;');
    ERR.forEach(e => console.log('%c  ' + e, 'color: #E74C3C;'));
  }
  console.log('%cCheck your Discord server! 🌹', 'color: #9B59B6; font-weight: bold;');
})();
