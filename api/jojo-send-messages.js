const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const SECRET = 'jojo-send-messages-2026';

function getHeaders() {
  return { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' };
}

async function api(method, path, body) {
  const opts = { method, headers: getHeaders() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://discord.com/api/v10${path}`, opts);
  if (res.status === 204) return null;
  if (!res.ok) { const e = await res.text(); throw new Error(`${res.status}: ${e}`); }
  return res.json();
}

async function sendEmbed(channelId, embed) {
  try {
    await api('POST', `/channels/${channelId}/messages`, { embeds: [embed] });
    return true;
  } catch (e) {
    console.error(`Failed to send to ${channelId}:`, e.message);
    return false;
  }
}

async function sendMessage(channelId, content) {
  try {
    await api('POST', `/channels/${channelId}/messages`, { content });
    return true;
  } catch (e) {
    console.error(`Failed to send to ${channelId}:`, e.message);
    return false;
  }
}

const GIFS = {
  // JJBA General
  dioZaWarudo: 'https://media.tenor.com/7Vxs-weYgXwAAAAM/jojo-za-warudo.gif',
  dioPointing: 'https://media.tenor.com/-ZLDlmutBvcAAAAM/dio.gif',
  dioBrando: 'https://media.tenor.com/KEEb1NGs__kAAAAM/dio-brando-dio.gif',
  jjbaGeneral: 'https://media.tenor.com/0LLm3nc6808AAAAM/jojo-bizarre-adventure.gif',
  jjbaAdventure: 'https://media.tenor.com/RjC4SP5Pd8cAAAAM/jojos-bizarre-adventure-jjba.gif',
  jjbaMeme: 'https://media.tenor.com/hVp_AEeLU7EAAAAM/jjba-jojos-bizarre-adventure.gif',
  dioWryyy: 'https://media.tenor.com/ZXlAmn2F7uQAAAAm/dio-wryyy.webp',
  dioGoodnight: 'https://media.tenor.com/xeJTJmzWxAEAAAAM/jjba-goodnight-dio-goodnight.gif',
  // Jotaro / Star Platinum
  jotaroStarPlatinum: 'https://media.tenor.com/nuKGpea_I4gAAAAm/star-platinum-heritage-for-the-future.webp',
  starPlatinumOra: 'https://media.tenor.com/7rVTSe8wpkkAAAAm/ora-jjba.webp',
  jotaroJolyne: 'https://media.tenor.com/-iHe29QNmpUAAAAM/kujo-jotaro-jolyne-kujo.gif',
  starPlatinumKujo: 'https://media.tenor.com/G-E9qVHu9pQAAAAM/star-platinum-kujo-jotaro.gif',
  // Stands / Misc
  killerQueen: 'https://media.tenor.com/qljo2BEYlVMAAAAM/dio-brando-dio.gif',
  goldExperience: 'https://media.tenor.com/smea7VkVoJwAAAAM/dio-jojo.gif',
  theWorld: 'https://media.tenor.com/NHPG_izn27IAAAAM/dio-brando-the-world.gif',
  zaWarudoPurple: 'https://media.tenor.com/Ku1-IHv2ZtsAAAAm/dio-brando-za-warudo.webp',
  jjbaStar: 'https://media.tenor.com/Ss87HXgE45AAAAAm/jojo-bizarre-adventure-jojo%27s-bizarre-adventure.webp',
  dioJJBA: 'https://media.tenor.com/KpCaSj-6uqQAAAAM/dio-jjba.gif',
  dioFire: 'https://media.tenor.com/8XQ-J0L3zN0AAAAM/dio-jjba.gif',
  jjbaAnime: 'https://media.tenor.com/0Xn2keDb06kAAAAM/jojo%27s-bizarre-adventure.gif',
};

const COLORS = {
  phantomBlood: 0x1E3A5F,
  battleTendency: 0xFF4500,
  stardust: 0x7B68EE,
  diamond: 0x003366,
  goldenWind: 0xFFD700,
  stoneOcean: 0x1ABC9C,
  sbr: 0xB22222,
  jojolion: 0x9932CC,
  general: 0x9B59B6,
  accent: 0xE74C3C,
  gold: 0xFFD700,
  purple: 0x9B59B6,
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!BOT_TOKEN) return res.status(500).json({ error: 'No bot token' });
  if (!req.body || req.body.secret !== SECRET) return res.status(403).json({ error: 'Bad secret' });

  const ids = req.body.ids || {};
  const log = [];
  let delay = 0;

  async function send(channelId, embedOrContent) {
    if (!channelId) { log.push('SKIP (no ID)'); return; }
    await new Promise(r => setTimeout(r, delay));
    const ok = typeof embedOrContent === 'string'
      ? await sendMessage(channelId, embedOrContent)
      : await sendEmbed(channelId, embedOrContent);
    log.push(`${channelId}: ${ok ? 'OK' : 'FAIL'}`);
    delay = 800;
  }

  // ══════════════════════════════════════════════════
  // 📜 RULES
  // ══════════════════════════════════════════════════
  await send(ids.rules, {
    title: 'Server Rules',
    description: 'Welcome to the JoJo\'s Bizarre Adventure Discord server! Please read these rules before participating.',
    color: COLORS.phantomBlood,
    image: { url: GIFS.jjbaGeneral },
    fields: [
      { name: 'Rule 1 — Respect Everyone', value: 'This is a friend group. Treat everyone like family. No harassment, hate speech, or personal attacks.', inline: false },
      { name: 'Rule 2 — No Drama', value: 'If there\'s an issue, talk it out or forget it. Common sense applies — you know what\'s right and wrong.', inline: false },
      { name: 'Rule 3 — Keep It Bizarre', value: 'This server is for JoJo content, VRChat sessions, YouTube content creation, and hanging out.', inline: false },
      { name: 'Rule 4 — No Spam or Self-Promo', value: 'Don\'t spam messages, links, or self-promote without permission.', inline: false },
      { name: 'Rule 5 — VRChat Focused', value: 'This server is primarily for our VRChat friend group. We do JoJo content together, hop on games, and have fun.', inline: false },
      { name: 'Rule 6 — Common Sense', value: 'Don\'t be weird, don\'t be toxic, don\'t start problems. If you have to ask if something\'s okay, it probably isn\'t.', inline: false },
      { name: 'Rule 7 — Have Fun', value: 'We\'re here to vibe, make content, and enjoy JoJo together.', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // ❓ FAQ
  // ══════════════════════════════════════════════════
  await send(ids.faq, {
    title: 'Frequently Asked Questions',
    description: 'Everything you need to know about this server.',
    color: COLORS.stardust,
    image: { url: GIFS.jotaroStarPlatinum },
    fields: [
      { name: 'Q: What is this server?', value: 'A: This is a JoJo\'s Bizarre Adventure friend group server. We met in VRChat and decided to make a community.', inline: false },
      { name: 'Q: How do I get a character role?', value: 'A: Go to role-select and click the button for your favorite character! Each role has a unique color.', inline: false },
      { name: 'Q: What content do you make?', value: 'A: Our main series is "JoJo Bros go to the Backrooms" and other VRChat adventures.', inline: false },
      { name: 'Q: Can I join VRChat sessions?', value: 'A: Absolutely! Check vrchat-chat for session announcements.', inline: false },
      { name: 'Q: Is this server only for JoJo fans?', value: 'A: Primarily yes, but we welcome anyone who vibes with the group.', inline: false },
      { name: 'Q: How do I become a content creator here?', value: 'A: Just suggest ideas in content-ideas and hop in when we record.', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // 📢 ANNOUNCEMENTS
  // ══════════════════════════════════════════════════
  await send(ids.announcements, {
    title: 'Welcome to the Bizarre Adventure!',
    description: 'This is the official JoJo\'s Bizarre Adventure friend group server.',
    color: COLORS.gold,
    image: { url: GIFS.dioZaWarudo },
    fields: [
      { name: 'VRChat Focused', value: 'We met in VRChat and that\'s where we spend most of our time. Jump in and join us!', inline: true },
      { name: 'Content Creation', value: 'We make YouTube content together — JoJo Bros go to the Backrooms and more!', inline: true },
      { name: 'JoJo Themed', value: 'Every member gets a JoJo character role with a unique color.', inline: true },
      { name: 'About Us', value: 'We\'re a group of friends who love JoJo, VRChat, and making content together. No drama, no stress — just vibes.', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // 🔗 LINKS
  // ══════════════════════════════════════════════════
  await send(ids.links, {
    title: 'Official Links',
    description: 'All the important links for the JoJo Bros.',
    color: COLORS.purple,
    image: { url: GIFS.jjbaAdventure },
    fields: [
      { name: 'YouTube', value: '[JoJo Bros YouTube](https://youtube.com/@jojobros) — Our content channel!', inline: false },
      { name: 'VRChat', value: 'Join our VRChat world sessions! Check vrchat-chat for schedules.', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // 🎭 ROLE SELECT (with buttons)
  // ══════════════════════════════════════════════════
  await send(ids.role_select, {
    title: 'Choose Your Stand User!',
    description: 'Pick your JoJo character role! Each role gives you a unique color in the member list.\n\nClick the buttons below to get your character role.',
    color: COLORS.gold,
    image: { url: GIFS.jjbaMeme },
    fields: [
      { name: 'Phantom Blood', value: 'Jonathan Joestar, Dio Brando, Zeppeli, Speedwagon, Erina, George I, Bruford, Tarkus, Dire, Straizo, Poco, Wang Chan', inline: false },
      { name: 'Battle Tendency', value: 'Joseph Joestar, Caesar Zeppeli, Lisa Lisa, Wamuu, Kars, Esidisi, Stroheim, Suzi Q, Messina, Loggins', inline: false },
      { name: 'Stardust Crusaders', value: 'Jotaro, Star Platinum, Polnareff, Silver Chariot, Kakyoin, Hierophant Green, Avdol, Magician Red, Iggy, The Fool, DIO, The World, Old Joseph, Hermit Purple, Hol Horse, Emperor, Boingo, Tohth, D\'Arby brothers, Vanilla Ice, Cream, Nukesaku, Alessi, Mariah, Bastet, Midler, High Priestess, N\'Doul, Geb, Oingo, Khnum, Anubis, Nena, The Lovers, Steely Dan, J. Geil, Hanged Man', inline: false },
      { name: 'Diamond Is Unbreakable', value: 'Josuke, Crazy Diamond, Okuyasu, The Hand, Rohan, Heaven\'s Door, Koichi, Echoes, Kira, Killer Queen, Hayato, Yukako, Tonio, Keicho, Bad Company, Akira, Red Hot Chili Pepper, Toyohiro, Super Fly, Yoshihiro, Stray Cat', inline: false },
      { name: 'Golden Wind', value: 'Giorno, Gold Experience, Bucciarati, Sticky Fingers, Mista, Sex Pistols, Narancia, Aerosmith, Abbacchio, Moody Blues, Fugo, Purple Haze, Diavolo, King Crimson, Trish, Spice Girl, Risotto, Metallica, Ghiaccio, White Album, Melone, Baby Face, Formaggio, Little Feet, Illuso, Man in the Mirror, Prosciutto, The Grateful Dead, Pesci, Beach Boy, Squalo, Clash, Tiziano, Talking Head, Cioccolata, Green Day, Secco, Oasis', inline: false },
      { name: 'Stone Ocean', value: 'Jolyne, Ermes, Foo Fighters, Weather Report, Emporio, Pucci, Whitesnake, C-Moon, Made in Heaven, Stone Free, Kiss, Burning Down the House, Diver Down, Miraschon, Gwess, Goo Goo Dolls, Narciso Anasui', inline: false },
      { name: 'Steel Ball Run', value: 'Johnny, Gyro, Funny Valentine, Diego Brando, Scary Monsters, Hot Pants, Cream Starter, Mountain Tim, Sandman, In a Silent Way, Wekapipo, Magent Magent, Axl RO, Civil War, Lucy Steel, Tusk, Ball Breaker, D4C', inline: false },
      { name: 'Jojolion', value: 'Josuke (Gappy), Yasuho, Tooru, Soft & Wet, Paisley Park, Wonder of U, Jobin, Speed King, Norisuke, Tsurugi, Paper Moon King, Daiya, California King Bed, Joshu, Nut King Call, Akefu, Ojiro, Fun Fun Fun, Doremifasolati Do', inline: false },
    ],
    footer: { text: 'Your path awaits, Stand user...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // 📋 MEMBER LIST
  // ══════════════════════════════════════════════════
  await send(ids.member_list, {
    title: 'Member List',
    description: 'Check the member list on the right to see everyone\'s character roles!\n\nEach member has a unique color based on their JoJo character.',
    color: COLORS.accent,
    image: { url: GIFS.dioPointing },
    fields: [
      { name: 'Our Crew', value: 'We\'re all Stand users in this server. Your role color represents your character.', inline: false },
      { name: 'Tip', value: 'Click the member list (right sidebar) to see everyone\'s roles and colors.', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // 🥽 VRCHAT CHAT
  // ══════════════════════════════════════════════════
  await send(ids.vrchat_chat, {
    title: 'VRChat Sessions',
    description: 'This is where we coordinate VRChat sessions and share worlds!',
    color: COLORS.goldenWind,
    image: { url: GIFS.jjbaAnime },
    fields: [
      { name: 'Session Times', value: 'We usually hop on in the evenings. Check here for announcements.', inline: false },
      { name: 'Worlds', value: 'Share your favorite VRChat worlds here! JoJo worlds are always welcome.', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // 🎬 CONTENT IDEAS
  // ══════════════════════════════════════════════════
  await send(ids.content_ideas, {
    title: 'Content Ideas',
    description: 'Pitch your YouTube content ideas here!',
    color: COLORS.phantomBlood,
    image: { url: GIFS.dioBrando },
    fields: [
      { name: 'Current Series', value: 'JoJo Bros go to the Backrooms, VRChat JoJo Adventures, Stand Battle Tournament', inline: false },
      { name: 'Ideas Board', value: 'Drop your ideas here! If it\'s good, we\'ll film it.', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // 🎲 DND CORNER
  // ══════════════════════════════════════════════════
  await send(ids.dnd_corner, {
    title: 'D&D Corner',
    description: 'Our tabletop corner! We occasionally run D&D sessions.',
    color: COLORS.battleTendency,
    image: { url: GIFS.starPlatinumOra },
    fields: [
      { name: 'Campaigns', value: 'Check here for session announcements and character sheets.', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // ☕ GENERAL CHAT
  // ══════════════════════════════════════════════════
  await send(ids.general, {
    title: 'General Chat',
    description: 'Welcome to the main hangout! Talk about anything here.',
    color: COLORS.stardust,
    image: { url: GIFS.jotaroJolyne },
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  // ══════════════════════════════════════════════════
  // 🤖 BOT COMMANDS
  // ══════════════════════════════════════════════════
  await send(ids.bot_commands, {
    title: 'Bot Commands',
    description: 'Use bot commands here! Type /help to see available commands.',
    color: COLORS.purple,
    image: { url: GIFS.goldExperience },
    fields: [
      { name: 'Commands', value: '/help — List all commands\n/role — Get your character role\n/roles — List all roles\n/server — Server info\n/avatar — Get someone\'s avatar\n/8ball — Ask the Stand Arrow\n/poll — Create a poll', inline: false },
    ],
    footer: { text: 'Yare yare daze...' },
    timestamp: new Date().toISOString()
  });

  return res.status(200).json({ success: true, log });
};
