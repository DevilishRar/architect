const ENCODED_BOT_TOKEN = process.env.BUILDER_BOT_TOKEN || '';
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

function bit() { return String([...arguments].reduce((a, b) => a | b, 0n)); }
const P = {
  VIEW: 1024n, SEND: 2048n, EMBED: 16384n, ATTACH: 32768n,
  MANAGE_CH: 16n, MANAGE_MSG: 8192n, MENTION: 131072n,
  KICK: 2n, BAN: 4n, ADMIN: 8n, MANAGE_ROLES: 268435456n,
  CHANGE_NICK: 67108864n, CONNECT: 1048576n, SPEAK: 2097152n,
  ADD_REACTIONS: 64n, READ_HIST: 65536n,
  SEND_THREADS: 274877906944n, CREATE_THREADS: 34359738368n,
  SEND_POLLS: 562949953421312n,
  MUTE: 4194304n, DEAFEN: 8388608n, MOVE: 16777216n,
  USE_VAD: 134217728n
};

const FULL = bit(P.VIEW, P.READ_HIST, P.SEND, P.EMBED, P.ATTACH, P.MANAGE_MSG, P.MENTION, P.ADD_REACTIONS, P.SEND_THREADS, P.CREATE_THREADS, P.SEND_POLLS);
const MOD  = bit(P.VIEW, P.READ_HIST, P.SEND, P.EMBED, P.ATTACH, P.MANAGE_MSG, P.MENTION, P.ADD_REACTIONS);
const SEND = bit(P.VIEW, P.READ_HIST, P.SEND, P.EMBED, P.ATTACH, P.ADD_REACTIONS);
const VIEW = bit(P.VIEW, P.READ_HIST);
const VOICE = bit(P.VIEW, P.CONNECT, P.SPEAK, P.USE_VAD);
const NONE = '0';
const DENY_VIEW = bit(P.VIEW);
const DENY_SEND = bit(P.SEND, P.SEND_THREADS, P.CREATE_THREADS, P.SEND_POLLS);
const DENY_ALL_CH = bit(P.SEND, P.SEND_THREADS, P.CREATE_THREADS, P.SEND_POLLS, P.ADD_REACTIONS);
const DENY_READ_CH = bit(P.SEND, P.SEND_THREADS, P.CREATE_THREADS, P.SEND_POLLS);
const FULL_VOICE = bit(P.VIEW, P.CONNECT, P.SPEAK, P.MUTE, P.DEAFEN, P.MOVE, P.MANAGE_CH, P.MENTION, P.USE_VAD);

const CONFIG = {
  // Positions: dividers get EVEN numbers, characters get ODD numbers within their section.
  // Higher position = higher in Discord role list.
  roles: [
    { name: 'Owner', color: 0xFFD700, permissions: bit(P.ADMIN), hoist: true, mentionable: false, position: 200 },
    // ── PHANTOM BLOOD ── (divider 190, chars 189-178)
    { name: '─── PHANTOM BLOOD ───', color: 0x000000, permissions: '0', hoist: false, mentionable: false, position: 190 },
    { name: 'Jonathan Joestar', color: 0x1E3A5F, permissions: '0', hoist: true, mentionable: false, position: 189 },
    { name: 'Dio Brando', color: 0xCC0000, permissions: '0', hoist: true, mentionable: false, position: 188 },
    { name: 'Will A. Zeppeli', color: 0xDAA520, permissions: '0', hoist: true, mentionable: false, position: 187 },
    { name: 'Speedwagon', color: 0x8B0000, permissions: '0', hoist: true, mentionable: false, position: 186 },
    { name: 'Erina Pendleton', color: 0xFFB6C1, permissions: '0', hoist: true, mentionable: false, position: 185 },
    { name: 'George Joestar I', color: 0x4682B4, permissions: '0', hoist: true, mentionable: false, position: 184 },
    { name: 'Bruford', color: 0x191970, permissions: '0', hoist: true, mentionable: false, position: 183 },
    { name: 'Tarkus', color: 0x2F4F4F, permissions: '0', hoist: true, mentionable: false, position: 182 },
    { name: 'Dire', color: 0xB22222, permissions: '0', hoist: true, mentionable: false, position: 181 },
    { name: 'Straizo', color: 0x4B0082, permissions: '0', hoist: true, mentionable: false, position: 180 },
    { name: 'Poco', color: 0x8FBC8F, permissions: '0', hoist: true, mentionable: false, position: 179 },
    { name: 'Wang Chan', color: 0x556B2F, permissions: '0', hoist: true, mentionable: false, position: 178 },
    // ── BATTLE TENDENCY ── (divider 170, chars 169-160)
    { name: '─── BATTLE TENDENCY ───', color: 0x000000, permissions: '0', hoist: false, mentionable: false, position: 170 },
    { name: 'Joseph Joestar', color: 0x228B22, permissions: '0', hoist: true, mentionable: false, position: 169 },
    { name: 'Caesar Zeppeli', color: 0xDC143C, permissions: '0', hoist: true, mentionable: false, position: 168 },
    { name: 'Lisa Lisa', color: 0x9932CC, permissions: '0', hoist: true, mentionable: false, position: 167 },
    { name: 'Wamuu', color: 0x2F4F4F, permissions: '0', hoist: true, mentionable: false, position: 166 },
    { name: 'Kars', color: 0xB8860B, permissions: '0', hoist: true, mentionable: false, position: 165 },
    { name: 'Esidisi', color: 0x8B0000, permissions: '0', hoist: true, mentionable: false, position: 164 },
    { name: 'Stroheim', color: 0x556B2F, permissions: '0', hoist: true, mentionable: false, position: 163 },
    { name: 'Suzi Q', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 162 },
    { name: 'Messina', color: 0x8B4513, permissions: '0', hoist: true, mentionable: false, position: 161 },
    { name: 'Loggins', color: 0xA0522D, permissions: '0', hoist: true, mentionable: false, position: 160 },
    // ── STARDUST CRUSADERS ── (divider 150, chars 149-112)
    { name: '─── STARDUST CRUSADERS ───', color: 0x000000, permissions: '0', hoist: false, mentionable: false, position: 150 },
    { name: 'Jotaro Kujo', color: 0x000080, permissions: '0', hoist: true, mentionable: false, position: 149 },
    { name: 'Star Platinum', color: 0x7B68EE, permissions: '0', hoist: true, mentionable: false, position: 148 },
    { name: 'Jean Pierre Polnareff', color: 0xC0C0C0, permissions: '0', hoist: true, mentionable: false, position: 147 },
    { name: 'Silver Chariot', color: 0xA9A9A9, permissions: '0', hoist: true, mentionable: false, position: 146 },
    { name: 'Noriaki Kakyoin', color: 0xDC143C, permissions: '0', hoist: true, mentionable: false, position: 145 },
    { name: 'Hierophant Green', color: 0x00AA00, permissions: '0', hoist: true, mentionable: false, position: 144 },
    { name: 'Muhammad Avdol', color: 0xFF4500, permissions: '0', hoist: true, mentionable: false, position: 143 },
    { name: 'Magician Red', color: 0xFF6347, permissions: '0', hoist: true, mentionable: false, position: 142 },
    { name: 'Iggy', color: 0x8B4513, permissions: '0', hoist: true, mentionable: false, position: 141 },
    { name: 'The Fool', color: 0xD2B48C, permissions: '0', hoist: true, mentionable: false, position: 140 },
    { name: 'DIO', color: 0xFFD700, permissions: '0', hoist: true, mentionable: false, position: 139 },
    { name: 'The World', color: 0xFFE4B5, permissions: '0', hoist: true, mentionable: false, position: 138 },
    { name: 'Old Joseph', color: 0x2E8B57, permissions: '0', hoist: true, mentionable: false, position: 137 },
    { name: 'Hermit Purple', color: 0x8B008B, permissions: '0', hoist: true, mentionable: false, position: 136 },
    { name: 'Hol Horse', color: 0xDAA520, permissions: '0', hoist: true, mentionable: false, position: 135 },
    { name: 'Emperor', color: 0xB8860B, permissions: '0', hoist: true, mentionable: false, position: 134 },
    { name: 'Boingo', color: 0xFFD700, permissions: '0', hoist: true, mentionable: false, position: 133 },
    { name: 'Tohth', color: 0x4169E1, permissions: '0', hoist: true, mentionable: false, position: 132 },
    { name: 'Daniel D\'Arby', color: 0x808080, permissions: '0', hoist: true, mentionable: false, position: 131 },
    { name: 'Telence D\'Arby', color: 0x2F4F4F, permissions: '0', hoist: true, mentionable: false, position: 130 },
    { name: 'Vanilla Ice', color: 0xE6E6FA, permissions: '0', hoist: true, mentionable: false, position: 129 },
    { name: 'Cream', color: 0x000000, permissions: '0', hoist: true, mentionable: false, position: 128 },
    { name: 'Nukesaku', color: 0xCD853F, permissions: '0', hoist: true, mentionable: false, position: 127 },
    { name: 'Alessi', color: 0x696969, permissions: '0', hoist: true, mentionable: false, position: 126 },
    { name: 'Mariah', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 125 },
    { name: 'Bastet', color: 0xFF1493, permissions: '0', hoist: true, mentionable: false, position: 124 },
    { name: 'Midler', color: 0xC71585, permissions: '0', hoist: true, mentionable: false, position: 123 },
    { name: 'High Priestess', color: 0x483D8B, permissions: '0', hoist: true, mentionable: false, position: 122 },
    { name: 'N\'Doul', color: 0x000000, permissions: '0', hoist: true, mentionable: false, position: 121 },
    { name: 'Geb', color: 0x00CED1, permissions: '0', hoist: true, mentionable: false, position: 120 },
    { name: 'Oingo', color: 0xFF8C00, permissions: '0', hoist: true, mentionable: false, position: 119 },
    { name: 'Khnum', color: 0xD2691E, permissions: '0', hoist: true, mentionable: false, position: 118 },
    { name: 'Anubis', color: 0xC0C0C0, permissions: '0', hoist: true, mentionable: false, position: 117 },
    { name: 'Nena', color: 0xFFB6C1, permissions: '0', hoist: true, mentionable: false, position: 116 },
    { name: 'The Lovers', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 115 },
    { name: 'Steely Dan', color: 0x808080, permissions: '0', hoist: true, mentionable: false, position: 114 },
    { name: 'J. Geil', color: 0x2F4F4F, permissions: '0', hoist: true, mentionable: false, position: 113 },
    { name: 'Hanged Man', color: 0xDAA520, permissions: '0', hoist: true, mentionable: false, position: 112 },
    // ── DIAMOND IS UNBREAKABLE ── (divider 100, chars 99-78)
    { name: '─── DIAMOND IS UNBREAKABLE ───', color: 0x000000, permissions: '0', hoist: false, mentionable: false, position: 100 },
    { name: 'Josuke Higashikata', color: 0x003366, permissions: '0', hoist: true, mentionable: false, position: 99 },
    { name: 'Crazy Diamond', color: 0x4169E1, permissions: '0', hoist: true, mentionable: false, position: 98 },
    { name: 'Okuyasu Nijimura', color: 0xCC0000, permissions: '0', hoist: true, mentionable: false, position: 97 },
    { name: 'The Hand', color: 0xB22222, permissions: '0', hoist: true, mentionable: false, position: 96 },
    { name: 'Rohan Kishibe', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 95 },
    { name: 'Heaven\'s Door', color: 0xFFB6C1, permissions: '0', hoist: true, mentionable: false, position: 94 },
    { name: 'Koichi Hirose', color: 0xFFD700, permissions: '0', hoist: true, mentionable: false, position: 93 },
    { name: 'Echoes', color: 0xFFA500, permissions: '0', hoist: true, mentionable: false, position: 92 },
    { name: 'Yoshikage Kira', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 91 },
    { name: 'Killer Queen', color: 0xFF1493, permissions: '0', hoist: true, mentionable: false, position: 90 },
    { name: 'Hayato Kawajiri', color: 0x87CEEB, permissions: '0', hoist: true, mentionable: false, position: 89 },
    { name: 'Yukako Yamagishi', color: 0x4B0082, permissions: '0', hoist: true, mentionable: false, position: 88 },
    { name: 'Tonio Trussardi', color: 0x006400, permissions: '0', hoist: true, mentionable: false, position: 87 },
    { name: 'Cure Kisses', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 86 },
    { name: 'Keicho Nijimura', color: 0x8B0000, permissions: '0', hoist: true, mentionable: false, position: 85 },
    { name: 'Bad Company', color: 0x556B2F, permissions: '0', hoist: true, mentionable: false, position: 84 },
    { name: 'Akira Otoishi', color: 0xFF4500, permissions: '0', hoist: true, mentionable: false, position: 83 },
    { name: 'Red Hot Chili Pepper', color: 0xFF6347, permissions: '0', hoist: true, mentionable: false, position: 82 },
    { name: 'Toyohiro Kanedaichi', color: 0x228B22, permissions: '0', hoist: true, mentionable: false, position: 81 },
    { name: 'Super Fly', color: 0x4682B4, permissions: '0', hoist: true, mentionable: false, position: 80 },
    { name: 'Yoshihiro Kira', color: 0x808080, permissions: '0', hoist: true, mentionable: false, position: 79 },
    { name: 'Stray Cat', color: 0xF5DEB3, permissions: '0', hoist: true, mentionable: false, position: 78 },
    // ── GOLDEN WIND ── (divider 70, chars 69-32)
    { name: '─── GOLDEN WIND ───', color: 0x000000, permissions: '0', hoist: false, mentionable: false, position: 70 },
    { name: 'Giorno Giovanna', color: 0xFFD700, permissions: '0', hoist: true, mentionable: false, position: 69 },
    { name: 'Gold Experience', color: 0xFFAA00, permissions: '0', hoist: true, mentionable: false, position: 68 },
    { name: 'Bruno Bucciarati', color: 0x9B59B6, permissions: '0', hoist: true, mentionable: false, position: 67 },
    { name: 'Sticky Fingers', color: 0x8E44AD, permissions: '0', hoist: true, mentionable: false, position: 66 },
    { name: 'Guido Mista', color: 0x27AE60, permissions: '0', hoist: true, mentionable: false, position: 65 },
    { name: 'Sex Pistols', color: 0x2ECC71, permissions: '0', hoist: true, mentionable: false, position: 64 },
    { name: 'Narancia Ghirga', color: 0x5DADE2, permissions: '0', hoist: true, mentionable: false, position: 63 },
    { name: 'Aerosmith', color: 0x3498DB, permissions: '0', hoist: true, mentionable: false, position: 62 },
    { name: 'Leone Abbacchio', color: 0x7F8C8D, permissions: '0', hoist: true, mentionable: false, position: 61 },
    { name: 'Moody Blues', color: 0x95A5A6, permissions: '0', hoist: true, mentionable: false, position: 60 },
    { name: 'Pannacotta Fugo', color: 0x9B59B6, permissions: '0', hoist: true, mentionable: false, position: 59 },
    { name: 'Purple Haze', color: 0x8E44AD, permissions: '0', hoist: true, mentionable: false, position: 58 },
    { name: 'Diavolo', color: 0xC0392B, permissions: '0', hoist: true, mentionable: false, position: 57 },
    { name: 'King Crimson', color: 0xE74C3C, permissions: '0', hoist: true, mentionable: false, position: 56 },
    { name: 'Trish Una', color: 0xFFB6C1, permissions: '0', hoist: true, mentionable: false, position: 55 },
    { name: 'Spice Girl', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 54 },
    { name: 'Risotto Nero', color: 0x2F4F4F, permissions: '0', hoist: true, mentionable: false, position: 53 },
    { name: 'Metallica', color: 0x808080, permissions: '0', hoist: true, mentionable: false, position: 52 },
    { name: 'Ghiaccio', color: 0xADD8E6, permissions: '0', hoist: true, mentionable: false, position: 51 },
    { name: 'White Album', color: 0xF0F8FF, permissions: '0', hoist: true, mentionable: false, position: 50 },
    { name: 'Melone', color: 0x006400, permissions: '0', hoist: true, mentionable: false, position: 49 },
    { name: 'Baby Face', color: 0xD2691E, permissions: '0', hoist: true, mentionable: false, position: 48 },
    { name: 'Formaggio', color: 0x696969, permissions: '0', hoist: true, mentionable: false, position: 47 },
    { name: 'Little Feet', color: 0x228B22, permissions: '0', hoist: true, mentionable: false, position: 46 },
    { name: 'Illuso', color: 0x4B0082, permissions: '0', hoist: true, mentionable: false, position: 45 },
    { name: 'Man in the Mirror', color: 0x9370DB, permissions: '0', hoist: true, mentionable: false, position: 44 },
    { name: 'Prosciutto', color: 0x8B0000, permissions: '0', hoist: true, mentionable: false, position: 43 },
    { name: 'The Grateful Dead', color: 0x556B2F, permissions: '0', hoist: true, mentionable: false, position: 42 },
    { name: 'Pesci', color: 0x00CED1, permissions: '0', hoist: true, mentionable: false, position: 41 },
    { name: 'Beach Boy', color: 0x40E0D0, permissions: '0', hoist: true, mentionable: false, position: 40 },
    { name: 'Squalo', color: 0x4682B4, permissions: '0', hoist: true, mentionable: false, position: 39 },
    { name: 'Clash', color: 0x1E90FF, permissions: '0', hoist: true, mentionable: false, position: 38 },
    { name: 'Tiziano', color: 0xFF4500, permissions: '0', hoist: true, mentionable: false, position: 37 },
    { name: 'Talking Head', color: 0xFF6347, permissions: '0', hoist: true, mentionable: false, position: 36 },
    { name: 'Cioccolata', color: 0x006400, permissions: '0', hoist: true, mentionable: false, position: 35 },
    { name: 'Green Day', color: 0x228B22, permissions: '0', hoist: true, mentionable: false, position: 34 },
    { name: 'Secco', color: 0xDAA520, permissions: '0', hoist: true, mentionable: false, position: 33 },
    { name: 'Oasis', color: 0xFF8C00, permissions: '0', hoist: true, mentionable: false, position: 32 },
    // ── STONE OCEAN ── (divider 20, chars 19-1)
    { name: '─── STONE OCEAN ───', color: 0x000000, permissions: '0', hoist: false, mentionable: false, position: 20 },
    { name: 'Jolyne Cujoh', color: 0x27AE60, permissions: '0', hoist: true, mentionable: false, position: 19 },
    { name: 'Ermes Costello', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 18 },
    { name: 'Foo Fighters', color: 0x1ABC9C, permissions: '0', hoist: true, mentionable: false, position: 17 },
    { name: 'Weather Report', color: 0x87CEEB, permissions: '0', hoist: true, mentionable: false, position: 16 },
    { name: 'Emporio Alnino', color: 0xFF8C00, permissions: '0', hoist: true, mentionable: false, position: 15 },
    { name: 'Enrico Pucci', color: 0xFFFFFF, permissions: '0', hoist: true, mentionable: false, position: 14 },
    { name: 'Green Green Grass of Home', color: 0x228B22, permissions: '0', hoist: true, mentionable: false, position: 13 },
    { name: 'Whitesnake', color: 0xF5F5F5, permissions: '0', hoist: true, mentionable: false, position: 12 },
    { name: 'C-Moon', color: 0xE6E6FA, permissions: '0', hoist: true, mentionable: false, position: 11 },
    { name: 'Made in Heaven', color: 0x87CEEB, permissions: '0', hoist: true, mentionable: false, position: 10 },
    { name: 'Stone Free', color: 0x4682B4, permissions: '0', hoist: true, mentionable: false, position: 9 },
    { name: 'Kiss', color: 0xFF1493, permissions: '0', hoist: true, mentionable: false, position: 8 },
    { name: 'Burning Down the House', color: 0xFF4500, permissions: '0', hoist: true, mentionable: false, position: 7 },
    { name: 'Diver Down', color: 0x1E90FF, permissions: '0', hoist: true, mentionable: false, position: 6 },
    { name: 'Miraschon', color: 0x9370DB, permissions: '0', hoist: true, mentionable: false, position: 5 },
    { name: 'Gwess', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: 4 },
    { name: 'Goo Goo Dolls', color: 0xDDA0DD, permissions: '0', hoist: true, mentionable: false, position: 3 },
    { name: 'Narciso Anasui', color: 0x4169E1, permissions: '0', hoist: true, mentionable: false, position: 2 },
    { name: 'Jolyne\'s Father', color: 0x191970, permissions: '0', hoist: true, mentionable: false, position: 1 },
    // ── STEEL BALL RUN ── (divider -10, chars -11 to -30)
    { name: '─── STEEL BALL RUN ───', color: 0x000000, permissions: '0', hoist: false, mentionable: false, position: -10 },
    { name: 'Johnny Joestar', color: 0x4169E1, permissions: '0', hoist: true, mentionable: false, position: -11 },
    { name: 'Gyro Zeppeli', color: 0x808080, permissions: '0', hoist: true, mentionable: false, position: -12 },
    { name: 'Funny Valentine', color: 0xB22222, permissions: '0', hoist: true, mentionable: false, position: -13 },
    { name: 'Diego Brando', color: 0xCC0000, permissions: '0', hoist: true, mentionable: false, position: -14 },
    { name: 'Scary Monsters', color: 0xFF4500, permissions: '0', hoist: true, mentionable: false, position: -15 },
    { name: 'Hot Pants', color: 0xFFB6C1, permissions: '0', hoist: true, mentionable: false, position: -16 },
    { name: 'Cream Starter', color: 0xFFFACD, permissions: '0', hoist: true, mentionable: false, position: -17 },
    { name: 'Mountain Tim', color: 0x8B4513, permissions: '0', hoist: true, mentionable: false, position: -18 },
    { name: 'Oh! Lonesome Me', color: 0x696969, permissions: '0', hoist: true, mentionable: false, position: -19 },
    { name: 'Sandman', color: 0xDAA520, permissions: '0', hoist: true, mentionable: false, position: -20 },
    { name: 'In a Silent Way', color: 0x4682B4, permissions: '0', hoist: true, mentionable: false, position: -21 },
    { name: 'Wekapipo', color: 0x556B2F, permissions: '0', hoist: true, mentionable: false, position: -22 },
    { name: 'Magent Magent', color: 0xCC0066, permissions: '0', hoist: true, mentionable: false, position: -23 },
    { name: 'Axl RO', color: 0xB22222, permissions: '0', hoist: true, mentionable: false, position: -24 },
    { name: 'Civil War', color: 0x808080, permissions: '0', hoist: true, mentionable: false, position: -25 },
    { name: 'Scarlet Valentine', color: 0xFF4500, permissions: '0', hoist: true, mentionable: false, position: -26 },
    { name: 'Lucy Steel', color: 0xFFB6C1, permissions: '0', hoist: true, mentionable: false, position: -27 },
    { name: 'Tusk', color: 0x4169E1, permissions: '0', hoist: true, mentionable: false, position: -28 },
    { name: 'Ball Breaker', color: 0xFFD700, permissions: '0', hoist: true, mentionable: false, position: -29 },
    { name: 'D4C', color: 0xB22222, permissions: '0', hoist: true, mentionable: false, position: -30 },
    // ── JOJOLION ── (divider -40, chars -41 to -59)
    { name: '─── JOJOLION ───', color: 0x000000, permissions: '0', hoist: false, mentionable: false, position: -40 },
    { name: 'Josuke Higashikata (Jojolion)', color: 0x9932CC, permissions: '0', hoist: true, mentionable: false, position: -41 },
    { name: 'Yasuho Hirose', color: 0xFF69B4, permissions: '0', hoist: true, mentionable: false, position: -42 },
    { name: 'Tooru', color: 0x4682B4, permissions: '0', hoist: true, mentionable: false, position: -43 },
    { name: 'Soft & Wet', color: 0xADD8E6, permissions: '0', hoist: true, mentionable: false, position: -44 },
    { name: 'Paisley Park', color: 0xFFB6C1, permissions: '0', hoist: true, mentionable: false, position: -45 },
    { name: 'Wonder of U', color: 0x4B0082, permissions: '0', hoist: true, mentionable: false, position: -46 },
    { name: 'Jobin Higashikata', color: 0x8B4513, permissions: '0', hoist: true, mentionable: false, position: -47 },
    { name: 'Speed King', color: 0xB8860B, permissions: '0', hoist: true, mentionable: false, position: -48 },
    { name: 'Norisuke Higashikata', color: 0x228B22, permissions: '0', hoist: true, mentionable: false, position: -49 },
    { name: 'Tsurugi Higashikata', color: 0x87CEEB, permissions: '0', hoist: true, mentionable: false, position: -50 },
    { name: 'Paper Moon King', color: 0xF0F8FF, permissions: '0', hoist: true, mentionable: false, position: -51 },
    { name: 'Daiya Higashikata', color: 0xFFB6C1, permissions: '0', hoist: true, mentionable: false, position: -52 },
    { name: 'California King Bed', color: 0xADD8E6, permissions: '0', hoist: true, mentionable: false, position: -53 },
    { name: 'Joshu Higashikata', color: 0x228B22, permissions: '0', hoist: true, mentionable: false, position: -54 },
    { name: 'Nut King Call', color: 0xDAA520, permissions: '0', hoist: true, mentionable: false, position: -55 },
    { name: 'Akefu Satoru', color: 0x4B0082, permissions: '0', hoist: true, mentionable: false, position: -56 },
    { name: 'Ojiro Kazo', color: 0x808080, permissions: '0', hoist: true, mentionable: false, position: -57 },
    { name: 'Fun Fun Fun', color: 0x4682B4, permissions: '0', hoist: true, mentionable: false, position: -58 },
    { name: 'Doremifasolati Do', color: 0xFF4500, permissions: '0', hoist: true, mentionable: false, position: -59 },
  ],

  categories: [
    // ══════════════════════════════════════════
    // MAIN - SERVER HUB (colored emoji — iconic)
    // ══════════════════════════════════════════
    {
      name: '🌹／JOJO\'S BIZARRE ADVENTURE',
      children: [
        { name: '꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂', type: 0, topic: '', decor: true },
        { name: '✦│rules', type: 0, topic: 'Read before entering — respect the famiglia' },
        { name: '✦│faq', type: 0, topic: 'Frequently asked questions about the server' },
        { name: '✦│announcements', type: 0, topic: 'News, updates, and important announcements' },
        { name: '✦│links', type: 0, topic: 'Useful links — YouTube, Discord, VRChat worlds' },
        { name: '✦│role-select', type: 0, topic: 'Pick your Stand user! Choose your character role below.' },
        { name: '✦│member-list', type: 0, topic: 'Who\'s in the crew?' },
        { name: '⫘⫘⫘⫘⫘⫘', type: 0, topic: '', decor: true }
      ]
    },
    // ══════════════════════════════════════════
    // PART 1 - PHANTOM BLOOD
    // ══════════════════════════════════════════
    {
      name: '⚔／PHANTOM BLOOD',
      children: [
        { name: '✦│phantom-blood-chat', type: 0, topic: 'Part 1 — Jonathan, Dio, Zeppeli, Speedwagon' },
        { name: '✦│write-of-passage', type: 0, topic: 'Share your favorite Part 1 moments' },
      ]
    },
    // ══════════════════════════════════════════
    // PART 2 - BATTLE TENDENCY
    // ══════════════════════════════════════════
    {
      name: '⚡／BATTLE TENDENCY',
      children: [
        { name: '✦│battle-tendency-chat', type: 0, topic: 'Part 2 — Joseph, Caesar, Lisa Lisa, Pillar Men' },
        { name: '✦│hamon-training', type: 0, topic: 'Training tips and Hamon discussions' },
      ]
    },
    // ══════════════════════════════════════════
    // PART 3 - STARDUST CRUSADERS
    // ══════════════════════════════════════════
    {
      name: '★／STARDUST CRUSADERS',
      children: [
        { name: '✦│stardust-chat', type: 0, topic: 'Part 3 — Jotaro, Polnareff, Kakyoin, Avdol, Iggy, DIO' },
        { name: '✦│stand-discussions', type: 0, topic: 'Talk about Stands, their abilities, and battles' },
      ]
    },
    // ══════════════════════════════════════════
    // PART 4 - DIAMOND IS UNBREAKABLE
    // ══════════════════════════════════════════
    {
      name: '◆／DIAMOND IS UNBREAKABLE',
      children: [
        { name: '✦│diamond-chat', type: 0, topic: 'Part 4 — Josuke, Okuyasu, Rohan, Koichi, Kira' },
        { name: '✦│morioh-map', type: 0, topic: 'Explore Morioh — locations, secrets, and lore' },
      ]
    },
    // ══════════════════════════════════════════
    // PART 5 - GOLDEN WIND
    // ══════════════════════════════════════════
    {
      name: '♦／GOLDEN WIND',
      children: [
        { name: '✦│golden-wind-chat', type: 0, topic: 'Part 5 — Giorno, Bucciarati, Mista, Narancia, Abbacchio, Fugo' },
        { name: '✦│passione-hq', type: 0, topic: 'Gang-Star discussions and Passione business' },
      ]
    },
    // ══════════════════════════════════════════
    // PART 6 - STONE OCEAN
    // ══════════════════════════════════════════
    {
      name: '◎／STONE OCEAN',
      children: [
        { name: '✦│stone-ocean-chat', type: 0, topic: 'Part 6 — Jolyne, Ermes, Foo Fighters, Weather, Emporio, Pucci' },
        { name: '✦│green-dolphin', type: 0, topic: 'Green Dolphin Street Prison talk' },
      ]
    },
    // ══════════════════════════════════════════
    // PART 7 - STEEL BALL RUN
    // ══════════════════════════════════════════
    {
      name: '⚔／STEEL BALL RUN',
      children: [
        { name: '✦│sbr-chat', type: 0, topic: 'Part 7 — Johnny, Gyro, Valentine, Diego' },
        { name: '✦│spin-technique', type: 0, topic: 'The Spin and its applications' },
      ]
    },
    // ══════════════════════════════════════════
    // PART 8 - JOJOLION
    // ══════════════════════════════════════════
    {
      name: '☽／JOJOLION',
      children: [
        { name: '✦│jojolion-chat', type: 0, topic: 'Part 8 — Josuke (Gappy), Yasuho, Tooru, Wonder of U' },
        { name: '✦│locacaca', type: 0, topic: 'The Locacaca Exchange and Rock Humans' },
      ]
    },
    // ══════════════════════════════════════════
    // VRCHAT & GAMING
    // ══════════════════════════════════════════
    {
      name: '◇／VRCHAT & GAMING',
      children: [
        { name: '✦│vrchat-chat', type: 0, topic: 'VRChat sessions, worlds, and shenanigans' },
        { name: '✦│content-ideas', type: 0, topic: 'YouTube content ideas — JoJo Bros go to the Backrooms etc.' },
        { name: '✦│dnd-corner', type: 0, topic: 'D&D and other tabletop discussions' },
        { name: '✦│screenshots', type: 0, topic: 'Share your VRChat screenshots and clips' },
      ]
    },
    // ══════════════════════════════════════════
    // HANGOUT
    // ══════════════════════════════════════════
    {
      name: '○／HANGOUT',
      children: [
        { name: '✦│general', type: 0, topic: 'General chat — talk about anything' },
        { name: '✦│bot-commands', type: 0, topic: 'Use bot commands here' },
        { name: '✦│music-share', type: 0, topic: 'Share music — JoJo OPs, OSTs, and more' },
        { name: '✦│media-share', type: 0, topic: 'Share memes, fan art, and edits' },
      ]
    },
    // ══════════════════════════════════════════
    // VOICE
    // ══════════════════════════════════════════
    {
      name: '▷／VOICE',
      children: [
        { name: '▷│general voice', type: 2 },
        { name: '▷│gaming session', type: 2 },
        { name: '▷│vrchat lobby', type: 2 },
        { name: '▷│content recording', type: 2 },
        { name: '▷│chill zone', type: 2 },
        { name: '▷│afk', type: 2 }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════
// PERMISSION LOGIC
// ═══════════════════════════════════════════════════════

function chPerms(roleIds, ch, guildId, botUserId) {
  const ow = [];
  const everyone = guildId;
  const n = ch.name.toLowerCase();
  const isDecor = ch.decor;

  // ── @everyone base ──
  if (isDecor) {
    ow.push({ id: everyone, type: 0, allow: VIEW, deny: DENY_ALL_CH });
  } else if (n.includes('rules') || n.includes('faq') || n.includes('announcements') || n.includes('links') || n.includes('member-list') || n.includes('role-select')) {
    ow.push({ id: everyone, type: 0, allow: VIEW, deny: DENY_READ_CH });
  } else if (ch.type === 2) {
    ow.push({ id: everyone, type: 0, allow: VOICE, deny: NONE });
  } else {
    ow.push({ id: everyone, type: 0, allow: bit(P.VIEW, P.SEND, P.READ_HIST), deny: NONE });
  }

  // ── Per-role overwrites ──
  for (const [name, id] of Object.entries(roleIds)) {
    if (name === 'Owner') {
      ow.push({ id, type: 0, allow: FULL, deny: '0' });
    } else if (ch.type === 2) {
      ow.push({ id, type: 0, allow: FULL_VOICE, deny: '0' });
    } else if (isDecor) {
      ow.push({ id, type: 0, allow: VIEW, deny: '0' });
    } else if (n.includes('rules') || n.includes('faq') || n.includes('announcements') || n.includes('links') || n.includes('member-list') || n.includes('role-select')) {
      ow.push({ id, type: 0, allow: VIEW, deny: '0' });
    } else {
      ow.push({ id, type: 0, allow: SEND, deny: '0' });
    }
  }

  // ── Bot user: FULL on everything ──
  if (botUserId) {
    ow.push({ id: botUserId, type: 1, allow: FULL, deny: '0' });
  }

  return ow;
}

// ═══════════════════════════════════════════════════════
// HANDLER
// ═══════════════════════════════════════════════════════

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;
  if (!body) return res.status(400).json({ error: 'No body' });
  if (body.secret !== 'jojo-build-2026') return res.status(403).json({ error: 'Invalid secret' });

  try { DECODED_TOKEN = decodeToken(ENCODED_BOT_TOKEN); } catch (e) { return res.status(500).json({ error: e.message }); }

  const guildId = body.guild_id;
  if (!guildId) return res.status(400).json({ error: 'guild_id required' });

  const log = [];

  try {
    const t = Date.now();

    // Get bot user
    const botUser = await api('GET', '/users/@me');
    const botUserId = botUser ? botUser.id : null;

    // ── CLEANUP ──
    log.push('Cleaning up existing channels and roles...');
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

    // ── CREATE ROLES ──
    log.push('Creating roles...');
    const roleIds = {};
    for (const def of CONFIG.roles) {
      const role = await api('POST', `/guilds/${guildId}/roles`, {
        name: def.name, color: def.color, permissions: def.permissions,
        hoist: def.hoist, mentionable: def.mentionable
      });
      if (role) roleIds[def.name] = role.id;
      await new Promise(r => setTimeout(r, 150));
    }

    // Order roles
    await api('PATCH', `/guilds/${guildId}/roles`,
      CONFIG.roles.map(r => ({ id: roleIds[r.name], position: r.position }))
    ).catch(() => null);
    await new Promise(r => setTimeout(r, 300));

    // ── CREATE CATEGORIES + CHANNELS ──
    log.push('Creating categories and channels...');
    const channelLookup = {};

    function cleanKey(name) {
      return name.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase().replace(/^_+|_+$/g, '');
    }

    for (const catDef of CONFIG.categories) {
      const catPermsOw = [];

      const cat = await api('POST', `/guilds/${guildId}/channels`, {
        name: catDef.name, type: 4, permission_overwrites: catPermsOw
      });
      if (!cat) continue;
      channelLookup[catDef.name] = cat.id;

      for (const chDef of catDef.children) {
        const chPayload = {
          name: chDef.name, type: chDef.type, parent_id: cat.id,
          topic: chDef.topic || undefined,
          permission_overwrites: chPerms(roleIds, chDef, guildId, botUserId)
        };
        if (chDef.decor) chPayload.flags = (1 << 21).toString();
        const ch = await api('POST', `/guilds/${guildId}/channels`, chPayload);
        if (ch) {
          const key = cleanKey(chDef.name);
          channelLookup[chDef.name] = ch.id;
          channelLookup[key] = ch.id;
        }
        await new Promise(r => setTimeout(r, 100));
      }
    }

    // ── OUTPUT ──
    const elapsed = ((Date.now() - t) / 1000).toFixed(1);
    log.push(`Done in ${elapsed}s`);

    const envOutput = [
      `# JoJo Server IDs`,
      `DISCORD_GUILD_ID=${guildId}`,
      `OWNER_ROLE_ID=${roleIds['Owner'] || ''}`,
      '',
      '# Character Roles',
      ...CONFIG.roles.filter(r => !r.name.startsWith('───')).map(r => `${r.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_ROLE_ID=${roleIds[r.name] || ''}`),
      '',
      '# Divider Roles',
      ...CONFIG.roles.filter(r => r.name.startsWith('───')).map(r => `${r.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_ROLE_ID=${roleIds[r.name] || ''}`),
      '',
      '# Channels',
      ...Object.entries(channelLookup)
        .filter(([k]) => !k.includes('│') && !k.includes('afx') && !k.includes('⫘'))
        .map(([name, id]) => `${name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_CHANNEL_ID=${id}`)
    ].join('\n');

    return res.status(200).json({
      success: true,
      log,
      roles: roleIds,
      channels: channelLookup,
      env: envOutput,
      elapsed: elapsed + 's'
    });

  } catch (e) {
    return res.status(500).json({ error: e.message, log });
  }
};
