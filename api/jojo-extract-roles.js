const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const GUILD_ID = '1542232461499441273';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!BOT_TOKEN) return res.status(500).json({ error: 'No bot token' });

  try {
    const guildId = req.body?.guild_id || GUILD_ID;
    const r = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const roles = await r.json();
    if (!Array.isArray(roles)) {
      return res.status(500).json({ error: 'Failed to fetch roles', data: roles });
    }

    const charNames = [
      'Jonathan Joestar','Dio Brando','Will A. Zeppeli','Speedwagon','Erina Pendleton',
      'George Joestar I','Bruford','Tarkus','Dire','Straizo','Poco','Wang Chan',
      'Joseph Joestar','Caesar Zeppeli','Lisa Lisa','Wamuu','Kars','Esidisi',
      'Stroheim','Suzi Q','Messina','Loggins',
      'Jotaro Kujo','Star Platinum','Jean Pierre Polnareff','Silver Chariot',
      'Noriaki Kakyoin','Hierophant Green','Muhammad Avdol','Magician Red',
      'Iggy','The Fool','DIO','The World','Old Joseph','Hermit Purple',
      'Hol Horse','Emperor','Boingo','Tohth',"Daniel D'Arby","Telence D'Arby",
      'Vanilla Ice','Cream','Nukesaku','Alessi','Mariah','Bastet',
      'Midler','High Priestess',"N'Doul",'Geb','Oingo','Khnum',
      'Anubis','Nena','The Lovers','Steely Dan','J. Geil','Hanged Man',
      'Josuke Higashikata','Crazy Diamond','Okuyasu Nijimura','The Hand',
      'Rohan Kishibe',"Heaven's Door",'Koichi Hirose','Echoes',
      'Yoshikage Kira','Killer Queen','Hayato Kawajiri','Yukako Yamagishi',
      'Tonio Trussardi','Cure Kisses','Keicho Nijimura','Bad Company',
      'Akira Otoishi','Red Hot Chili Pepper','Toyohiro Kanedaichi','Super Fly',
      'Yoshihiro Kira','Stray Cat',
      'Giorno Giovanna','Gold Experience','Bruno Bucciarati','Sticky Fingers',
      'Guido Mista','Sex Pistols','Narancia Ghirga','Aerosmith',
      'Leone Abbacchio','Moody Blues','Pannacotta Fugo','Purple Haze',
      'Diavolo','King Crimson','Trish Una','Spice Girl',
      'Risotto Nero','Metallica','Ghiaccio','White Album',
      'Melone','Baby Face','Formaggio','Little Feet',
      'Illuso','Man in the Mirror','Prosciutto','The Grateful Dead',
      'Pesci','Beach Boy','Squalo','Clash',
      'Tiziano','Talking Head','Cioccolata','Green Day','Secco','Oasis',
      'Jolyne Cujoh','Ermes Costello','Foo Fighters','Weather Report',
      'Emporio Alnino','Enrico Pucci','Green Green Grass of Home','Whitesnake',
      'C-Moon','Made in Heaven','Stone Free','Kiss',
      'Burning Down the House','Diver Down','Miraschon','Gwess',
      'Goo Goo Dolls','Narciso Anasui',"Jolyne's Father",
      'Johnny Joestar','Gyro Zeppeli','Funny Valentine','Diego Brando',
      'Scary Monsters','Hot Pants','Cream Starter','Mountain Tim',
      'Oh! Lonesome Me','Sandman','In a Silent Way','Wekapipo',
      'Magent Magent','Axl RO','Civil War','Scarlet Valentine',
      'Lucy Steel','Tusk','Ball Breaker','D4C',
      'Josuke Higashikata (Jojolion)','Yasuho Hirose','Tooru','Soft & Wet',
      'Paisley Park','Wonder of U','Jobin Higashikata','Speed King',
      'Norisuke Higashikata','Tsurugi Higashikata','Paper Moon King',
      'Daiya Higashikata','California King Bed','Joshu Higashikata',
      'Nut King Call','Akefu Satoru','Ojiro Kazo','Fun Fun Fun',
      'Doremifasolati Do'
    ];

    const dividers = [
      '─── PHANTOM BLOOD ───','─── BATTLE TENDENCY ───',
      '─── STARDUST CRUSADERS ───','─── DIAMOND IS UNBREAKABLE ───',
      '─── GOLDEN WIND ───','─── STONE OCEAN ───',
      '─── STEEL BALL RUN ───','─── JOJOLION ───'
    ];

    const lines = ['# JoJo Server IDs', `DISCORD_GUILD_ID=${guildId}`, '', '# Character Roles'];
    for (const name of charNames) {
      const role = roles.find(r => r.name === name);
      const key = name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toUpperCase();
      lines.push(`${key}_ROLE_ID=${role ? role.id : 'NOT_FOUND'}`);
    }

    lines.push('', '# Divider Roles');
    for (const name of dividers) {
      const role = roles.find(r => r.name === name);
      const key = name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toUpperCase();
      lines.push(`${key}_ROLE_ID=${role ? role.id : 'NOT_FOUND'}`);
    }

    lines.push('', '# Channels');
    const chR = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const channels = await chR.json();
    if (Array.isArray(channels)) {
      for (const ch of channels) {
        const key = ch.name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toUpperCase();
        lines.push(`${key}_CHANNEL_ID=${ch.id}`);
      }
    }

    return res.status(200).json({ success: true, env: lines.join('\n'), role_count: roles.length, channel_count: Array.isArray(channels) ? channels.length : 0 });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
