const ENCODED_BOT_TOKEN = process.env.BUILDER_BOT_TOKEN || 'TVRVME1UQXpNakEyTWpVM01EVTVPRFEyTUEuR0NYd0tQLmhELW8tME9sRWpuZy0tV0FabzF2d045eTNfUlFHcHc0VkY2eS0w';
const REST = 'https://discord.com/api/v10';
let DECODED_TOKEN = '';
let rateLimitReset = 0;

function decodeToken(encoded) {
  try { return Buffer.from(encoded, 'base64').toString('utf8'); } catch (e) { throw new Error('Failed to decode bot token'); }
}

function getHeaders() {
  return { Authorization: `Bot ${DECODED_TOKEN}`, 'Content-Type': 'application/json' };
}

async function api(method, path, body) {
  const now = Date.now();
  if (now < rateLimitReset) await new Promise(r => setTimeout(r, rateLimitReset - now + 50));
  const opts = { method, headers: getHeaders() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${REST}${path}`, opts);
  const retry = res.headers.get('retry-after');
  if (retry) {
    rateLimitReset = Date.now() + parseFloat(retry) * 1000 + 200;
    await new Promise(r => setTimeout(r, parseFloat(retry) * 1000 + 300));
    return api(method, path, body);
  }
  if (res.status === 204) return null;
  if (!res.ok) { const e = await res.text(); throw new Error(`${res.status}: ${e}`); }
  return res.json();
}

const B = '\u2502';
function bit() { return String([...arguments].reduce((a, b) => a | b, 0n)); }
const P = {
  VIEW: 1024n, SEND: 2048n, EMBED: 16384n, ATTACH: 32768n,
  MANAGE_CH: 16n, MANAGE_MSG: 8192n, MENTION: 131072n,
  KICK: 2n, BAN: 4n, ADMIN: 8n, MANAGE_ROLES: 268435456n,
  CHANGE_NICK: 67108864n, CONNECT: 1048576n, SPEAK: 2097152n,
  ADD_REACTIONS: 64n, READ_HIST: 65536n,
  SEND_THREADS: 274877906944n, CREATE_THREADS: 34359738368n,
  SEND_POLLS: 562949953421312n,
  MUTE: 4194304n, DEAFEN: 8388608n, MOVE: 16777216n
};

const FULL = bit(P.VIEW, P.READ_HIST, P.SEND, P.EMBED, P.ATTACH, P.MANAGE_MSG, P.MENTION, P.ADD_REACTIONS, P.SEND_THREADS, P.CREATE_THREADS, P.SEND_POLLS);

const CONFIG = {
  roles: [
    { name: 'Owner', color: 0xE74C3C, permissions: bit(P.ADMIN), hoist: true, mentionable: false, position: 6 },
    { name: 'Seller', color: 0xE67E22, permissions: bit(P.MANAGE_CH, P.MANAGE_MSG, P.MENTION, P.VIEW, P.SEND, P.EMBED, P.ATTACH), hoist: true, mentionable: true, position: 5 },
    { name: 'Staff', color: 0x3498DB, permissions: bit(P.KICK, P.MANAGE_MSG, P.MENTION, P.VIEW, P.SEND, P.EMBED, P.ATTACH), hoist: true, mentionable: true, position: 4 },
    { name: 'Verified Customer', color: 0x2ECC71, permissions: bit(P.CHANGE_NICK), hoist: false, mentionable: false, position: 3 },
    { name: 'Member', color: 0x808080, permissions: '0', hoist: false, mentionable: false, position: 2 }
  ],
  // Unicode Art Reference:
  //   TOP HEADER (decorative):     ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂
  //   DIVIDER (between channels):  ⫘⫘⫘⫘⫘⫘
  //   BOTTOM END:                  ∘₊✧──────✧₊∘  OR  ▬▬ι════════ﺤ
  //   Channel format:              emoji│name (│ directly before first letter, NO space after │)
  //   Category format:             emoji／NAME (／ as spacer)
  categories: [
    {
      name: `ℹ️／INFO`,
      children: [
        { name: `꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂`, type: 0, topic: '', decor: true },
        { name: `📌│rules`, type: 0, topic: 'Server rules and guidelines' },
        { name: `📢│announcements`, type: 0, topic: 'Important updates and news' },
        { name: `💻│product catalog`, type: 0, topic: 'Browse our products and pricing' },
        { name: `🔗│links`, type: 0, topic: 'Important links and resources' },
        { name: `⫘⫘⫘⫘⫘⫘`, type: 0, topic: '', decor: true }
      ]
    },
    {
      name: `☄️／GENERAL`,
      children: [
        { name: `꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂`, type: 0, topic: '', decor: true },
        { name: `◉│general chat`, type: 0, topic: 'General conversation' },
        { name: `◉│off topic`, type: 0, topic: 'Off-topic discussion' },
        { name: `⫘⫘⫘⫘⫘⫘`, type: 0, topic: '', decor: true }
      ]
    },
    {
      name: `⭐／VERIFIED`,
      children: [
        { name: `꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂`, type: 0, topic: '', decor: true },
        { name: `💎│verified chat`, type: 0, topic: 'Exclusive chat for verified customers' },
        { name: `🔐│verified voice`, type: 2 }
      ]
    },
    {
      name: `❖／SUPPORT`,
      children: [
        { name: `꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂`, type: 0, topic: '', decor: true },
        { name: `✦│open your ticket`, type: 0, topic: 'Select a product from the dropdown to open a ticket' },
        { name: `✦│ticket logs`, type: 0, topic: 'Ticket activity logs' },
        { name: `⫘⫘⫘⫘⫘⫘`, type: 0, topic: '', decor: true }
      ]
    },
    {
      name: `✴／STAFF`,
      children: [
        { name: `꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂`, type: 0, topic: '', decor: true },
        { name: `🛡️│staff chat`, type: 0, topic: 'Private staff discussion', private: true },
        { name: `📨│order notifications`, type: 0, topic: 'New order alerts', private: true },
        { name: `💰│xmr addresses`, type: 0, topic: 'Payment wallet addresses', private: true },
        { name: `⫘⫘⫘⫘⫘⫘`, type: 0, topic: '', decor: true }
      ]
    },
    {
      name: `◇／VOICE`,
      children: [
        { name: `꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂`, type: 0, topic: '', decor: true },
        { name: `▷│general voice`, type: 2 },
        { name: `▷│support voice`, type: 2 }
      ]
    }
  ]
};

function chPerms(roleIds, ch, guildId, botUserId) {
  const ow = [];
  const n = ch.name;
  const everyone = guildId;
  const isDecor = ch.decor === true;
  const isRead = n.includes('rules') || n.includes('announcements') || n.includes('product') || n.includes('links');
  const isHidden = n.includes('ticket') && n.includes('logs') || n.includes('staff') && n.includes('chat') || n.includes('order') || n.includes('xmr') || n.includes('addresses');
  const isVerified = n.includes('verified');
  const isVoice = ch.type === 2;

  // Permission presets for readability
  const MOD    = bit(P.VIEW, P.READ_HIST, P.SEND, P.EMBED, P.ATTACH, P.MANAGE_MSG, P.MENTION, P.ADD_REACTIONS);
  const SEND   = bit(P.VIEW, P.READ_HIST, P.SEND, P.EMBED, P.ATTACH, P.ADD_REACTIONS);
  const VIEW   = bit(P.VIEW, P.READ_HIST);
  const VOICE  = bit(P.VIEW, P.CONNECT, P.SPEAK);
  const NONE   = '0';
  const DENY_VIEW    = bit(P.VIEW);
  const DENY_SEND    = bit(P.SEND, P.SEND_THREADS, P.CREATE_THREADS, P.SEND_POLLS);
  const DENY_REACT   = bit(P.ADD_REACTIONS);
  const DENY_ALL_CH  = bit(P.SEND, P.SEND_THREADS, P.CREATE_THREADS, P.SEND_POLLS, P.ADD_REACTIONS);
  const DENY_READ_CH = bit(P.SEND, P.SEND_THREADS, P.CREATE_THREADS, P.SEND_POLLS);
  const EMEM = bit(P.MUTE, P.DEAFEN, P.MOVE);
  const FULL_VOICE = bit(P.VIEW, P.CONNECT, P.SPEAK, P.MUTE, P.DEAFEN, P.MOVE, P.MANAGE_CH, P.MENTION);

  // Role index shortcuts
  const OWNER = 0, SELLER = 1, STAFF = 2, VERIFIED = 3, MEMBER = 4;
  const roles = Object.entries(roleIds);

  // ============================================
  // @everyone overwrite (guild ID, NOT '0')
  // ============================================
  if (isDecor) {
    ow.push({ id: everyone, type: 0, allow: VIEW, deny: DENY_ALL_CH });
  } else if (isRead) {
    ow.push({ id: everyone, type: 0, allow: VIEW, deny: DENY_READ_CH });
  } else if (isVerified || isHidden) {
    ow.push({ id: everyone, type: 0, allow: NONE, deny: DENY_VIEW });
  } else if (isVoice) {
    ow.push({ id: everyone, type: 0, allow: VOICE, deny: NONE });
  } else {
    ow.push({ id: everyone, type: 0, allow: bit(P.VIEW, P.SEND, P.READ_HIST), deny: NONE });
  }

  // ============================================
  // Explicit per-role overwrites for EVERY role
  // Discord: role allows OR'd together override @everyone deny
  // Must set EVERY role explicitly — no skipping
  // ============================================
  for (const [name, id] of roles) {
    const idx = CONFIG.roles.findIndex(r => r.name === name);
    let allow = NONE;
    let deny  = NONE;

    if (isDecor) {
      // Decorative: everyone is VIEW only, deny everything else
      // Explicitly deny all roles to make it clear in UI
      deny = DENY_ALL_CH;

    } else if (isRead) {
      // ── READ-ONLY: everyone can VIEW, nobody sends ──
      // Owner/Seller/Staff: allow SEND (override @everyone deny)
      // Verified/Member: explicit DENY to reinforce @everyone
      if (idx === OWNER) {
        allow = FULL;
      } else if (idx <= STAFF) {
        allow = MOD;
      } else {
        deny = DENY_READ_CH;
      }

    } else if (isVerified) {
      // ── EXCLUSIVE (verified+): @everyone denies VIEW ──
      // Owner: full | Seller: mod | Staff: send | Verified: send
      // Member: explicit DENY VIEW to reinforce @everyone
      if (idx === OWNER) {
        allow = MOD;
      } else if (idx === SELLER) {
        allow = MOD;
      } else if (idx === STAFF) {
        allow = SEND;
      } else if (idx === VERIFIED) {
        allow = SEND;
      } else {
        deny = DENY_VIEW;
      }

    } else if (isHidden) {
      // ── HIDDEN (staff+): @everyone denies VIEW ──
      // Owner: full | Seller: mod | Staff: send
      // Verified/Member: explicit DENY VIEW to reinforce @everyone
      if (idx === OWNER) {
        allow = MOD;
      } else if (idx === SELLER) {
        allow = MOD;
      } else if (idx === STAFF) {
        allow = SEND;
      } else {
        deny = DENY_VIEW;
      }

    } else if (isVoice) {
      // ── VOICE: everyone connects+speaks ──
      // Owner: full voice management
      // All others: explicit VOICE (redundant but visible in UI)
      if (idx === OWNER) {
        allow = FULL_VOICE;
      } else {
        allow = VOICE;
      }

    } else {
      // ── NORMAL: everyone can send ──
      // Owner: full | Seller/Staff: mod | Verified/Member: send
      if (idx === OWNER) {
        allow = FULL;
      } else if (idx <= STAFF) {
        allow = MOD;
      } else {
        allow = SEND;
      }
    }

    ow.push({ id, type: 0, allow, deny });
  }

  // Add bot user with FULL permissions so it can always send
  if (botUserId) {
    ow.push({ id: botUserId, type: 1, allow: FULL, deny: '0' });
  }

  return ow;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = req.body || {};
    if (body.secret !== 'ambrosia-build-2026') return res.status(403).json({ error: 'Invalid secret' });
    try { DECODED_TOKEN = decodeToken(ENCODED_BOT_TOKEN); } catch (e) { return res.status(500).json({ error: e.message }); }

    const guildId = body.guild_id;
    if (!guildId) return res.status(400).json({ error: 'guild_id required' });

    const t = Date.now();

    // Get bot's own user ID so we can add it to channel overwrites
    const botUser = await api('GET', '/users/@me');
    const botUserId = botUser ? botUser.id : null;

    const [allChannels, allRoles] = await Promise.all([
      api('GET', `/guilds/${guildId}/channels`),
      api('GET', `/guilds/${guildId}/roles`)
    ]);

    for (const ch of allChannels.filter(c => c.type !== 4).sort((a, b) => b.position - a.position)) {
      await api('DELETE', `/channels/${ch.id}`).catch(() => null);
      await new Promise(r => setTimeout(r, 100));
    }
    for (const cat of allChannels.filter(c => c.type === 4).sort((a, b) => b.position - a.position)) {
      await api('DELETE', `/channels/${cat.id}`).catch(() => null);
      await new Promise(r => setTimeout(r, 100));
    }
    for (const role of allRoles.filter(r => r.name !== '@everyone' && !r.managed)) {
      await api('DELETE', `/guilds/${guildId}/roles/${role.id}`).catch(() => null);
      await new Promise(r => setTimeout(r, 100));
    }
    await new Promise(r => setTimeout(r, 1000));

    const roleIds = {};
    for (const def of CONFIG.roles) {
      const role = await api('POST', `/guilds/${guildId}/roles`, {
        name: def.name, color: def.color, permissions: def.permissions,
        hoist: def.hoist, mentionable: def.mentionable
      });
      if (role) roleIds[def.name] = role.id;
      await new Promise(r => setTimeout(r, 150));
    }

    await api('PATCH', `/guilds/${guildId}/roles`,
      CONFIG.roles.map(r => ({ id: roleIds[r.name], position: r.position }))
    ).catch(() => null);
    await new Promise(r => setTimeout(r, 300));

    const channelLookup = {};
    const catLookup = {};
    for (const catDef of CONFIG.categories) {
      const catPermsOw = [];
      const isVerifiedCat = catDef.name.includes('VERIFIED');
      const isStaffCat = catDef.name.includes('STAFF');

      if (isVerifiedCat) {
        catPermsOw.push({ id: guildId, type: 0, allow: '0', deny: bit(P.VIEW) });
        for (const [name, id] of Object.entries(roleIds)) {
          const idx = CONFIG.roles.findIndex(r => r.name === name);
          if (idx <= 3) catPermsOw.push({ id, type: 0, allow: bit(P.VIEW), deny: '0' });
        }
        if (botUserId) catPermsOw.push({ id: botUserId, type: 1, allow: FULL, deny: '0' });
      } else if (isStaffCat) {
        catPermsOw.push({ id: guildId, type: 0, allow: '0', deny: bit(P.VIEW) });
        for (const [name, id] of Object.entries(roleIds)) {
          const idx = CONFIG.roles.findIndex(r => r.name === name);
          if (idx <= 2) catPermsOw.push({ id, type: 0, allow: bit(P.VIEW), deny: '0' });
        }
        if (botUserId) catPermsOw.push({ id: botUserId, type: 1, allow: FULL, deny: '0' });
      }

      const cat = await api('POST', `/guilds/${guildId}/channels`, {
        name: catDef.name, type: 4, permission_overwrites: catPermsOw
      });
      if (!cat) continue;
      const plainCat = catDef.name.replace(/[^\w\s\uff0f]/g, '').replace(/\uff0f/g, '').trim().replace(/\s+/g, ' ').toLowerCase();
      catLookup[plainCat] = cat.id;

      for (const chDef of catDef.children) {
        const chPayload = {
          name: chDef.name, type: chDef.type, parent_id: cat.id,
          topic: chDef.topic || undefined,
          permission_overwrites: chPerms(roleIds, chDef, guildId, botUserId)
        };
        if (chDef.private) chPayload.flags = (1 << 21).toString();
        const ch = await api('POST', `/guilds/${guildId}/channels`, chPayload);
        if (ch) {
          const plainCh = chDef.name.replace(/[^\w\s\u2502]/g, '').replace(/\u2502/g, '').trim().replace(/\s+/g, ' ').toLowerCase();
          channelLookup[plainCh] = ch.id;
        }
        await new Promise(r => setTimeout(r, 100));
      }
    }

    const elapsed = ((Date.now() - t) / 1000).toFixed(1);
    return res.status(200).json({
      success: true, time: `${elapsed}s`, guild_id: guildId,
      roles: roleIds, categories: catLookup, channels: channelLookup
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
