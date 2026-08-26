const ENCODED_BOT_TOKEN = process.env.BUILDER_BOT_TOKEN || '';
const PUBLIC_KEY = process.env.BUILDER_PUBLIC_KEY || '';
const crypto = require('crypto');

let DECODED_TOKEN = '';
function decodeToken(encoded) {
  try { return Buffer.from(encoded, 'base64').toString('utf8'); } catch { return ''; }
}

function getHeaders() {
  return { Authorization: `Bot ${DECODED_TOKEN}`, 'Content-Type': 'application/json' };
}

async function api(method, path, body) {
  const opts = { method, headers: getHeaders() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://discord.com/api/v10${path}`, opts);
  if (res.status === 204) return null;
  if (!res.ok) { const e = await res.text(); throw new Error(`${res.status}: ${e}`); }
  return res.json();
}

// ── CHARACTER ROLE MAP ──
const CHAR_ROLES = {
  // Phantom Blood
  'jonathan-joestar': 'Jonathan Joestar', 'dio-brando': 'Dio Brando',
  'will-zeppeli': 'Will A. Zeppeli', 'speedwagon': 'Speedwagon',
  'erina-pendleton': 'Erina Pendleton', 'george-joestar-i': 'George Joestar I',
  'bruford': 'Bruford', 'tarkus': 'Tarkus',
  'dire': 'Dire', 'straizo': 'Straizo',
  'poco': 'Poco', 'wang-chan': 'Wang Chan',
  // Battle Tendency
  'joseph-joestar': 'Joseph Joestar', 'caesar-zeppeli': 'Caesar Zeppeli',
  'lisa-lisa': 'Lisa Lisa', 'wamuu': 'Wamuu',
  'kars': 'Kars', 'esidisi': 'Esidisi',
  'stroheim': 'Stroheim', 'suzi-q': 'Suzi Q',
  'messina': 'Messina', 'loggins': 'Loggins',
  // Stardust Crusaders
  'jotaro-kujo': 'Jotaro Kujo', 'star-platinum': 'Star Platinum',
  'polnareff': 'Jean Pierre Polnareff', 'silver-chariot': 'Silver Chariot',
  'kakyoin': 'Noriaki Kakyoin', 'hierophant-green': 'Hierophant Green',
  'avdol': 'Muhammad Avdol', 'magician-red': 'Magician Red',
  'iggy': 'Iggy', 'the-fool': 'The Fool',
  'dio-3': 'DIO', 'the-world': 'The World',
  'old-joseph': 'Old Joseph', 'hermit-purple': 'Hermit Purple',
  'hol-horse': 'Hol Horse', 'emperor': 'Emperor',
  'boingo': 'Boingo', 'tohth': 'Tohth',
  'daniel-darby': "Daniel D'Arby", 'telence-darby': "Telence D'Arby",
  'vanilla-ice': 'Vanilla Ice', 'cream': 'Cream',
  'nukesaku': 'Nukesaku', 'alessi': 'Alessi',
  'mariah': 'Mariah', 'bastet': 'Bastet',
  'midler': 'Midler', 'high-priestess': 'High Priestess',
  'ndoul': "N'Doul", 'geb': 'Geb',
  'oingo': 'Oingo', 'khnum': 'Khnum',
  'anubis': 'Anubis', 'nena': 'Nena',
  'the-lovers': 'The Lovers', 'steely-dan': 'Steely Dan',
  'j-geil': 'J. Geil', 'hanged-man': 'Hanged Man',
  // Diamond Is Unbreakable
  'josuke': 'Josuke Higashikata', 'crazy-diamond': 'Crazy Diamond',
  'okuyasu': 'Okuyasu Nijimura', 'the-hand': 'The Hand',
  'rohan': 'Rohan Kishibe', 'heavens-door': "Heaven's Door",
  'koichi': 'Koichi Hirose', 'echoes': 'Echoes',
  'kira': 'Yoshikage Kira', 'killer-queen': 'Killer Queen',
  'hayato': 'Hayato Kawajiri', 'yukako': 'Yukako Yamagishi',
  'tonio': 'Tonio Trussardi', 'cure-kisses': 'Cure Kisses',
  'keicho': 'Keicho Nijimura', 'bad-company': 'Bad Company',
  'akira': 'Akira Otoishi', 'red-hot-chili-pepper': 'Red Hot Chili Pepper',
  'toyohiro': 'Toyohiro Kanedaichi', 'super-fly': 'Super Fly',
  'yoshihiro': 'Yoshihiro Kira', 'stray-cat': 'Stray Cat',
  // Golden Wind
  'giorno': 'Giorno Giovanna', 'gold-experience': 'Gold Experience',
  'bucciarati': 'Bruno Bucciarati', 'sticky-fingers': 'Sticky Fingers',
  'mista': 'Guido Mista', 'sex-pistols': 'Sex Pistols',
  'narancia': 'Narancia Ghirga', 'aerosmith': 'Aerosmith',
  'abbacchio': 'Leone Abbacchio', 'moody-blues': 'Moody Blues',
  'fugo': 'Pannacotta Fugo', 'purple-haze': 'Purple Haze',
  'diavolo': 'Diavolo', 'king-crimson': 'King Crimson',
  'trish': 'Trish Una', 'spice-girl': 'Spice Girl',
  'risotto': 'Risotto Nero', 'metallica': 'Metallica',
  'ghiaccio': 'Ghiaccio', 'white-album': 'White Album',
  'melone': 'Melone', 'baby-face': 'Baby Face',
  'formaggio': 'Formaggio', 'little-feet': 'Little Feet',
  'illuso': 'Illuso', 'man-in-the-mirror': 'Man in the Mirror',
  'prosciutto': 'Prosciutto', 'the-grateful-dead': 'The Grateful Dead',
  'pesci': 'Pesci', 'beach-boy': 'Beach Boy',
  'squalo': 'Squalo', 'clash': 'Clash',
  'tiziano': 'Tiziano', 'talking-head': 'Talking Head',
  'cioccolata': 'Cioccolata', 'green-day': 'Green Day',
  'secco': 'Secco', 'oasis': 'Oasis',
  // Stone Ocean
  'jolyne': 'Jolyne Cujoh', 'ermes': 'Ermes Costello',
  'foo-fighters': 'Foo Fighters', 'weather-report': 'Weather Report',
  'emporio': 'Emporio Alnino', 'pucci': 'Enrico Pucci',
  'green-grass': 'Green Green Grass of Home', 'whitesnake': 'Whitesnake',
  'c-moon': 'C-Moon', 'made-in-heaven': 'Made in Heaven',
  'stone-free': 'Stone Free', 'kiss': 'Kiss',
  'burning-down': 'Burning Down the House', 'diver-down': 'Diver Down',
  'miraschon': 'Miraschon', 'gwess': 'Gwess',
  'goo-goo-dolls': 'Goo Goo Dolls', 'anasui': 'Narciso Anasui',
  'jolyne-father': "Jolyne's Father",
  // Steel Ball Run
  'johnny-joestar': 'Johnny Joestar', 'gyro-zeppeli': 'Gyro Zeppeli',
  'funny-valentine': 'Funny Valentine', 'diego-brando': 'Diego Brando',
  'scary-monsters': 'Scary Monsters', 'hot-pants': 'Hot Pants',
  'cream-starter': 'Cream Starter', 'mountain-tim': 'Mountain Tim',
  'oh-lonesome': 'Oh! Lonesome Me', 'sandman': 'Sandman',
  'in-a-silent-way': 'In a Silent Way', 'wekapipo': 'Wekapipo',
  'magent-magent': 'Magent Magent', 'axl-ro': 'Axl RO',
  'civil-war': 'Civil War', 'scarlet-valentine': 'Scarlet Valentine',
  'lucy-steel': 'Lucy Steel', 'tusk': 'Tusk',
  'ball-breaker': 'Ball Breaker', 'd4c': 'D4C',
  // Jojolion
  'josuke-jojolion': 'Josuke Higashikata (Jojolion)', 'yasuho': 'Yasuho Hirose',
  'tooru': 'Tooru', 'soft-wet': 'Soft & Wet',
  'paisley-park': 'Paisley Park', 'wonder-of-u': 'Wonder of U',
  'jobin': 'Jobin Higashikata', 'speed-king': 'Speed King',
  'norisuke': 'Norisuke Higashikata', 'tsurugi': 'Tsurugi Higashikata',
  'paper-moon-king': 'Paper Moon King', 'daiya': 'Daiya Higashikata',
  'california-king-bed': 'California King Bed', 'joshu': 'Joshu Higashikata',
  'nut-king-call': 'Nut King Call', 'akefu': 'Akefu Satoru',
  'ojiro': 'Ojiro Kazo', 'fun-fun-fun': 'Fun Fun Fun',
  'doremifasolati': 'Doremifasolati Do',
};

function verifySignature(signature, timestamp, body) {
  if (!PUBLIC_KEY) return true;
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(timestamp + body);
    return verify.verify(
      { key: `-----BEGIN PUBLIC KEY-----\n${PUBLIC_KEY}\n-----END PUBLIC KEY-----`, format: 'der', type: 'spki' },
      Buffer.from(signature, 'hex')
    );
  } catch { return false; }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Signature-Ed25519, X-Signature-Timestamp');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Verify signature
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = JSON.stringify(req.body);
  if (!verifySignature(signature, timestamp, rawBody)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try { DECODED_TOKEN = decodeToken(ENCODED_BOT_TOKEN); } catch { return res.status(500).json({ error: 'Token failed' }); }

  const { type, data, member, guild_id } = req.body;

  // PING
  if (type === 1) return res.status(200).json({ type: 1 });

  // APPLICATION_COMMAND
  if (type === 2) {
    const cmd = data.name;

    if (cmd === 'help') {
      return res.status(200).json({
        type: 4,
        data: {
          embeds: [{
            title: 'JoJo Bot Commands',
            color: 0x9B59B6,
            fields: [
              { name: '/help', value: 'Show this help message', inline: true },
              { name: '/role <character>', value: 'Get a character role', inline: true },
              { name: '/roles', value: 'List all available character roles', inline: true },
              { name: '/server', value: 'Show server info', inline: true },
              { name: '/avatar [user]', value: 'Get a user\'s avatar', inline: true },
              { name: '/8ball <question>', value: 'Ask the Stand Arrow', inline: true },
              { name: '/poll <question>', value: 'Create a yes/no poll', inline: true },
            ],
            footer: { text: 'Yare yare daze...' }
          }]
        }
      });
    }

    if (cmd === 'roles') {
      const roleList = Object.values(CHAR_ROLES).join('\n');
      return res.status(200).json({
        type: 4,
        data: {
          embeds: [{
            title: 'Available Character Roles',
            description: roleList,
            color: 0xFFD700,
            footer: { text: 'Use /role <name> to get a role!' }
          }]
        }
      });
    }

    if (cmd === 'role') {
      const charName = data.options?.[0]?.value?.toLowerCase().replace(/\s+/g, '-');
      const roleName = CHAR_ROLES[charName];
      if (!roleName) {
        return res.status(200).json({
          type: 4,
          data: { content: '❌ Character not found! Use /roles to see available characters.', flags: 64 }
        });
      }

      try {
        const roles = await api('GET', `/guilds/${guild_id}/roles`);
        const role = roles.find(r => r.name === roleName);
        if (!role) return res.status(200).json({ type: 4, data: { content: '❌ Role not found on server.', flags: 64 } });

        // Remove existing character roles
        const memberRoles = member.roles || [];
        const charRoleIds = [];
        for (const rName of Object.values(CHAR_ROLES)) {
          const r = roles.find(x => x.name === rName);
          if (r && memberRoles.includes(r.id)) charRoleIds.push(r.id);
        }
        if (charRoleIds.length) {
          await api('DELETE', `/guilds/${guild_id}/members/${member.user.id}/roles/${charRoleIds.join(',')}`);
        }

        // Add new role
        await api('PUT', `/guilds/${guild_id}/members/${member.user.id}/roles/${role.id}`);

        return res.status(200).json({
          type: 4,
          data: {
            embeds: [{
              title: 'Role Assigned!',
              description: `You are now **${roleName}**!`,
              color: role.color || 0x9B59B6,
              footer: { text: 'Yare yare daze...' }
            }],
            flags: 64
          }
        });
      } catch (e) {
        return res.status(200).json({ type: 4, data: { content: '❌ Failed to assign role: ' + e.message, flags: 64 } });
      }
    }

    if (cmd === 'server') {
      try {
        const guild = await api('GET', `/guilds/${guild_id}?with_counts=true`);
        return res.status(200).json({
          type: 4,
          data: {
            embeds: [{
              title: guild.name,
              color: 0xFFD700,
              fields: [
                { name: '👥 Members', value: String(guild.approximate_member_count || '?'), inline: true },
                { name: '💬 Channels', value: String(guild.approximate_channel_count || '?'), inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(new Date(guild.created_at).getTime() / 1000)}:R>`, inline: true },
              ],
              footer: { text: 'Yare yare daze...' }
            }]
          }
        });
      } catch { return res.status(200).json({ type: 4, data: { content: '❌ Could not fetch server info.', flags: 64 } }); }
    }

    if (cmd === 'avatar') {
      const user = data.options?.[0]?.resolved?.users?.[Object.keys(data.options[0].resolved.users)[0]] || member.user;
      const avatar = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=2048`
        : `https://cdn.embedavatar.com/embed.js?name=${encodeURIComponent(user.username)}`;
      return res.status(200).json({
        type: 4,
        data: {
          embeds: [{
            title: user.username + "'s Avatar",
            image: { url: avatar },
            color: 0x9B59B6,
          }]
        }
      });
    }

    if (cmd === '8ball') {
      const answers = [
        'Yes, yes, yes! 🌹', 'No, no, no! 💀', 'Yare yare daze...',
        'The Stand Arrow has spoken!', 'Za Warudo says maybe...',
        'Muda muda muda! (No.)', 'Ora ora ora! (Yes!)',
        'Your Stand agrees.', 'The fate of the world says yes.',
        'Ask Speedwagon, he\'ll know.', 'Even Speedwagon would say yes!',
        'This is the greatest high!', 'WRYYYYYY! (That\'s a yes.)',
      ];
      return res.status(200).json({
        type: 4,
        data: {
          embeds: [{
            title: 'The Stand Arrow Speaks...',
            description: answers[Math.floor(Math.random() * answers.length)],
            color: 0x9B59B6,
            footer: { text: 'Yare yare daze...' }
          }]
        }
      });
    }

    if (cmd === 'poll') {
      const question = data.options?.[0]?.value || 'No question provided';
      return res.status(200).json({
        type: 4,
        data: {
          embeds: [{
            title: 'Poll',
            description: question,
            color: 0x9B59B6,
            footer: { text: 'React with ✅ or ❌' }
          }]
        }
      });
    }

    return res.status(200).json({ type: 4, data: { content: 'Unknown command.', flags: 64 } });
  }

  // MESSAGE_COMPONENT (buttons)
  if (type === 3) {
    const customId = data.custom_id;
    if (customId.startsWith('role_')) {
      const charKey = customId.replace('role_', '');
      const roleName = CHAR_ROLES[charKey];
      if (!roleName) return res.status(200).json({ type: 4, data: { content: '❌ Role not found.', flags: 64 } });

      try {
        const roles = await api('GET', `/guilds/${guild_id}/roles`);
        const role = roles.find(r => r.name === roleName);
        if (!role) return res.status(200).json({ type: 4, data: { content: '❌ Role not found on server.', flags: 64 } });

        const memberRoles = member.roles || [];
        const charRoleIds = [];
        for (const rName of Object.values(CHAR_ROLES)) {
          const r = roles.find(x => x.name === rName);
          if (r && memberRoles.includes(r.id)) charRoleIds.push(r.id);
        }
        if (charRoleIds.length) {
          await api('DELETE', `/guilds/${guild_id}/members/${member.user.id}/roles/${charRoleIds.join(',')}`);
        }
        await api('PUT', `/guilds/${guild_id}/members/${member.user.id}/roles/${role.id}`);

        return res.status(200).json({
          type: 7,
          data: {
            embeds: [{
              title: 'Role Updated!',
              description: `You are now **${roleName}**!`,
              color: role.color || 0x9B59B6,
            }]
          }
        });
      } catch (e) {
        return res.status(200).json({ type: 7, data: { content: '❌ Failed: ' + e.message } });
      }
    }
  }

  return res.status(200).json({ type: 1 });
};
