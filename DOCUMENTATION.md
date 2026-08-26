# Discord Server Builder - Complete Documentation

> Universal framework for building any Discord server from scratch.

---

## 1. Overview

**Discord Server Builder** is a standalone bot that creates an entire Discord server structure from scratch: roles, categories, channels, and permissions. It runs as a Vercel serverless function triggered from the browser console.

**What it builds (default template):**
- 5 roles with a full permission hierarchy
- 6 categories with 15 channels
- Complete permission matrix for every channel type
- Voice channels
- Exclusive channels for specific roles
- Private channels with spoiler overlay

**What it does NOT do:**
- Post embeds or messages (pair with your own bot for that)
- Handle tickets, purchases, or interactions
- Run 24/7 (it is a one-time build tool)

**Tech stack:**
- Vercel serverless functions (Node.js)
- Discord REST API v10
- Browser console for triggering
- No dependencies (pure fetch API)

**Works for any server type:**
- Selling / store servers
- Gaming communities
- Hangout / social servers
- Development / project servers
- Content creator communities
- Educational servers
- Support desk servers

The default template is a selling server structure. Edit the `CONFIG` object in `builder.js` to customize roles, channels, categories, and permissions for your use case.

---

## 2. Architecture

```
builder-bot/
  api/
    builder.js          # Serverless function - the engine
  console-builder.js    # Browser console script (not deployed)
  index.html            # Landing page
  styles.css            # Website styling
  app.js                # Frontend logic
  package.json
  README.md
```

### How It Works

1. User opens browser console on any website
2. Pastes console-builder.js content
3. Script prompts for Server ID
4. Script sends POST request to api/builder.js on Vercel
5. Builder function fetches existing channels/roles, deletes everything, waits 1s, creates 5 roles, reorders roles via PATCH, creates 6 categories with permission overwrites, creates 15 channels, returns all IDs as JSON
6. Console script receives IDs, prints them, generates .env file, copies to clipboard

### Serverless Function Constraints

| Limit | Value |
|-------|-------|
| Execution time | 10 seconds max |
| Memory | 1024 MB |
| Cold start | 1-3 seconds |
| Region | US East (iad1) |

---

## 3. Setup Guide

### Step 1: Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click New Application, name it Architect
3. Go to Bot tab, click Add Bot
4. Enable MESSAGE CONTENT INTENT and SERVER MEMBERS INTENT
5. Copy the Bot Token

### Step 2: Invite Bot

1. Go to OAuth2, URL Generator
2. Scopes: bot, applications.commands
3. Permissions: Administrator
4. Copy URL, open in browser, invite to server

### Step 3: Deploy to Vercel

1. Create new GitHub repo
2. Upload all files from builder-bot/
3. Go to vercel.com, Import repo, Deploy
4. Copy your Vercel URL

### Step 4: Update Console Script

Open console-builder.js and set BUILDER_URL to your Vercel URL.

### Step 5: Run

1. Open any website, press F12, Console tab
2. Paste console-builder.js, press Enter
3. Enter Server ID when prompted
4. Wait for completion
5. .env copies to clipboard

---

## 4. Default Server Structure (Template)

This is the default selling server template. Edit `CONFIG` in `builder.js` to change it.

**Category names** use `／` (fullwidth solidus) as spacer: `emoji／NAME`
**Channel names** use `│` (box-drawing vertical bar) as spacer: `emoji│name` (no spaces)
**Decorative channels** use Unicode art for visual flair in the sidebar

```
ℹ️／INFO
  ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂        (decorative header)
  📌│rules
  📢│announcements
  💻│product catalog
  🔗│links
  ⫘⫘⫘⫘⫘⫘                  (decorative divider)

☄️／GENERAL
  ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂        (decorative header)
  ◉│general chat
  ◉│off topic
  ⫘⫘⫘⫘⫘⫘                  (decorative divider)

⭐／VERIFIED
  ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂        (decorative header)
  💎│verified chat
  🔐│verified voice           (no divider — voice always below text)

❖／SUPPORT
  ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂        (decorative header)
  ✦│open your ticket
  ✦│ticket logs
  ⫘⫘⫘⫘⫘⫘                  (decorative divider)

✴／STAFF
  ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂        (decorative header)
  🛡️│staff chat        (private)
  📨│order notifications (private)
  💰│xmr addresses      (private)
  ⫘⫘⫘⫘⫘⫘                  (decorative divider)

◇／VOICE
  ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂        (decorative header)
  ▷│general voice
  ▷│support voice             (no end marker — voice always below text)
```

### Channel Name Format

**Correct:** `emoji│name` — │ directly before first letter, NO space after │
**Correct:** `emoji│name with spaces` — spaces only between words
**Wrong:** `emoji│ name` — space after │
**Wrong:** `emoji │ name` — space before │
**Wrong:** `emoji│word│word` — │ between words

### ⚠️ CRITICAL: Voice + Text in Same Category

**Discord ALWAYS places voice channels below text channels in a category**, regardless of position you set. This means:

- Bottom decorative markers (`⫘⫘⫘⫘⫘⫘`, `∘₊✧──────✧₊∘`) will appear **ABOVE** voice channels, breaking the visual effect
- **Fix:** If a category has voice channels, do NOT put a bottom divider — it will never be at the bottom
- **Better fix:** Put voice channels in their own dedicated category (like `◇／VOICE`)

**Correct:**
```
⭐／VERIFIED
  ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂        (header — OK)
  💎│verified chat            (text)
  🔐│verified voice           (voice — always below text, NO divider after)
```

**Wrong:**
```
⭐／VERIFIED
  ꧀⎝ 𓆩༺✧༻𓆪 ⎠꧂        (header)
  💎│verified chat            (text)
  ⫘⫘⫘⫘⫘⫘                  (divider — WRONG, voice will be below this)
  🔐│verified voice           (voice — Discord forces this below divider)
```

### Decorative Channel Rules

- **Categories**: CAN use spaces — `emoji／NAME` with fullwidth solidus
- **Text channels**: `emoji │ name` — space after │ is NORMAL
- **Voice channels**: `emoji │ name` — same format
- **Decorative channels**: pure Unicode art as the entire channel name
- Decorative channels are read-only — everyone can see, nobody can send
- Decorative channels are not added to the lookup keys

### Channel Name Format (#1 RULE)

```
CORRECT:   📌│rules            (│ directly before first letter, NO space after)
CORRECT:   💻│product catalog  (space only between words, NOT after │)
WRONG:     📌│ rules           (space after │ — NO)
WRONG:     📌 │ rules          (space before │ — NO)
WRONG:     📌│product│catalog  (│ between words — NO)
```

**The `│` goes DIRECTLY before the first letter of the channel name. NO space after │.**

### Alternative Structures

**Gaming Server:**
```
🎮 GAMING
  📌 rules
  📢 announcements
  🎮 looking for group
  🏆 achievements

💬 GENERAL
  ◉ general chat
  ◉ media sharing
  ◉ off topic

🎯 TEAMS
  ✦ team 1
  ✦ team 2
  ✦ team 3

🎙️ VOICE
  ▷ gaming voice 1
  ▷ gaming voice 2
  ▷ afk
```

**Hangout Server:**
```
📌 INFO
  📌 rules
  📢 announcements
  🎭 about us

💬 CHAT
  ◉ general
  ◉ memes
  ◉ music
  ◉ art

🌟 COMMUNITY
  💎 vip chat
  🎉 events

🎙️ VOICE
  ▷ lounge
  ▷ music room
  ▷ afk
```

**Dev/Project Server:**
```
📋 PROJECT
  📌 readme
  📢 updates
  📋 roadmap

💻 DEV
  ◉ general dev
  ◉ help
  ◉ code review
  ◉ show and tell

🐛 ISSUES
  ✦ bug reports
  ✦ feature requests
  ✦ resolved

🔒 MAINTAINERS
  🛡️ maintainer chat
  📨 CI/CD notifications

🎙️ VOICE
  ▷ pair programming
  ▷ standup
```

---

## 5. Role System

### Default Roles (Selling Server Template)

| Position | Role | Color | Permissions |
|----------|------|-------|-------------|
| 1 (top) | Owner | Red #E74C3C | Administrator |
| 2 | Seller | Orange #E67E22 | Manage Channels, Manage Messages, Mention Everyone, View, Send, Embed, Attach |
| 3 | Staff | Blue #3498DB | Kick Members, Manage Messages, Mention Everyone, View, Send, Embed, Attach |
| 4 | Verified Customer | Green #2ECC71 | Change Nickname |
| 5 (bottom) | Member | Gray #808080 | None |

### Role Details (Default)

**Owner:** Administrator, bypasses all checks, hoisted, not mentionable
**Seller:** Manage Channels + Manage Messages + Mention Everyone + full chat perms, hoisted, mentionable
**Staff:** Kick Members + Manage Messages + Mention Everyone + full chat perms, hoisted, mentionable
**Verified Customer:** Change Nickname only, not hoisted
**Member:** No special perms, inherits @everyone

Roles are reordered via PATCH /guilds/{id}/roles after creation.

### Customizing Roles

Edit the `CONFIG.roles` array in `builder.js`. Each role object:

```javascript
{
  name: 'Role Name',
  color: 0xHEXCOLOR,
  permissions: bit(P.ADMIN),
  hoist: true,
  mentionable: false,
  position: 6
}
```

### Common Role Setups

**Gaming Server:**
```javascript
roles: [
  { name: 'Owner',    color: 0xE74C3C, permissions: bit(P.ADMIN), ... },
  { name: 'Admin',    color: 0xE67E22, permissions: bit(P.MANAGE_CH, P.MANAGE_MSG, P.MENTION, P.VIEW, P.SEND, P.EMBED, P.ATTACH), ... },
  { name: 'Moderator', color: 0x3498DB, permissions: bit(P.KICK, P.MANAGE_MSG, P.MENTION, P.VIEW, P.SEND, P.EMBED, P.ATTACH), ... },
  { name: 'VIP',      color: 0xF1C40F, permissions: bit(P.CHANGE_NICK), ... },
  { name: 'Member',   color: 0x808080, permissions: '0', ... }
]
```

**Community/Hangout Server:**
```javascript
roles: [
  { name: 'Admin',     color: 0xE74C3C, permissions: bit(P.ADMIN), ... },
  { name: 'Moderator', color: 0x3498DB, permissions: bit(P.KICK, P.MANAGE_MSG, P.MENTION, P.VIEW, P.SEND, P.EMBED, P.ATTACH), ... },
  { name: 'OG',        color: 0x9B59B6, permissions: bit(P.VIEW, P.SEND, P.EMBED, P.ATTACH), ... },
  { name: 'Member',    color: 0x808080, permissions: '0', ... }
]
```

**Dev/Project Server:**
```javascript
roles: [
  { name: 'Owner',       color: 0xE74C3C, permissions: bit(P.ADMIN), ... },
  { name: 'Maintainer',  color: 0xE67E22, permissions: bit(P.MANAGE_CH, P.MANAGE_MSG, P.VIEW, P.SEND, P.EMBED, P.ATTACH), ... },
  { name: 'Contributor', color: 0x3498DB, permissions: bit(P.VIEW, P.SEND, P.EMBED, P.ATTACH), ... },
  { name: 'User',        color: 0x808080, permissions: '0', ... }
]
```

---

## 6. Channel Permission Matrix

The permission system works by role index (position in the CONFIG.roles array):
- **Role 0** (top): Full admin/management
- **Role 1**: Management (channels, messages, mentions)
- **Role 2**: Moderation (kick, messages, mentions)
- **Role 3**: Trusted (view + limited special perms)
- **Role 4** (bottom): Basic member

**Discord permission rule:** Role allows OR'd together always override @everyone deny. Only the highest role's allow matters.

### Read-Only Channels (rules, announcements, product catalog, links)

| Role | Allow | Deny |
|------|-------|------|
| @everyone | VIEW, READ_HIST | SEND, SEND_THREADS, CREATE_THREADS, SEND_POLLS |
| Role 4 (Member) | (nothing extra — VIEW from @everyone) | - |
| Role 3 (Verified) | (nothing extra — VIEW from @everyone) | - |
| Role 2 (Staff) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS | - |
| Role 1 (Seller) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS | - |
| Role 0 (Owner) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS, SEND_THREADS, CREATE_THREADS, SEND_POLLS | - |

### Normal Channels (general chat, off topic)

| Role | Allow | Deny |
|------|-------|------|
| @everyone | VIEW, READ_HIST, SEND | - |
| Role 4 (Member) | VIEW, READ_HIST, SEND, EMBED, ATTACH, ADD_REACTIONS | - |
| Role 3 (Verified) | VIEW, READ_HIST, SEND, EMBED, ATTACH, ADD_REACTIONS | - |
| Role 2 (Staff) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS | - |
| Role 1 (Seller) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS | - |
| Role 0 (Owner) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS, SEND_THREADS, CREATE_THREADS, SEND_POLLS | - |

### Exclusive Channels (verified+ only — verified chat, verified voice)

| Role | Allow | Deny |
|------|-------|------|
| @everyone | - | VIEW |
| Role 4 (Member) | (nothing — @everyone deny=VIEW blocks them) | - |
| Role 3 (Verified) | VIEW, READ_HIST, SEND, EMBED, ATTACH, ADD_REACTIONS | - |
| Role 2 (Staff) | VIEW, READ_HIST, SEND, EMBED, ATTACH, ADD_REACTIONS | - |
| Role 1 (Seller) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS | - |
| Role 0 (Owner) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS | - |

### Hidden Channels (staff+ only — staff chat, order notifications, xmr addresses)

| Role | Allow | Deny |
|------|-------|------|
| @everyone | - | VIEW |
| Role 4 (Member) | (nothing — @everyone deny=VIEW blocks them) | - |
| Role 3 (Verified) | (nothing — @everyone deny=VIEW blocks them) | - |
| Role 2 (Staff) | VIEW, READ_HIST, SEND, EMBED, ATTACH, ADD_REACTIONS | - |
| Role 1 (Seller) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS | - |
| Role 0 (Owner) | VIEW, READ_HIST, SEND, EMBED, ATTACH, MANAGE_MSG, MENTION, ADD_REACTIONS | - |

### Voice Channels (general voice, support voice)

| Role | Allow | Deny |
|------|-------|------|
| @everyone | VIEW, CONNECT, SPEAK | - |
| Role 4 (Member) | VIEW, CONNECT, SPEAK | - |
| Role 3 (Verified) | VIEW, CONNECT, SPEAK | - |
| Role 2 (Staff) | VIEW, CONNECT, SPEAK | - |
| Role 1 (Seller) | VIEW, CONNECT, SPEAK | - |
| Role 0 (Owner) | VIEW, CONNECT, SPEAK, MUTE, DEAFEN, MOVE, MANAGE_CH, MENTION | - |

---

## 7. Visual Styling Guide (Default Template)

### Design Philosophy

Two visual styles alternating between categories:

1. **Colored Emoji Style** - Discord native colored emojis for categories and select channels
2. **Outline Unicode Style** - Geometric outline symbols for other channels

### Category Styling (all colored emojis)

| Category | Emoji |
|----------|-------|
| INFO | ℹ️ info source |
| GENERAL | ☄️ comet |
| VERIFIED | ⭐ star |
| SUPPORT | ❖ black diamond minus white x |
| STAFF | ✴ eight pointed star |
| VOICE | ◇ white diamond |

### Channel Styling (alternating)

| Category | Style | Channels |
|----------|-------|----------|
| INFO | Colored | 📌 rules, 🔔 announcements, 💻 product catalog, 🔗 links |
| GENERAL | Outline | ◉ general chat, ◉ off topic |
| VERIFIED | Colored | 💎 verified chat, 🔐 verified voice |
| SUPPORT | Outline | ✦ open your ticket, ✦ ticket logs |
| STAFF | Colored | 🛡️ staff chat, 📨 order notifications, 💰 xmr addresses |
| VOICE | Outline | ▷ general voice, ▷ support voice |

### Customizing Emojis

Edit the `CONFIG.categories` array in `builder.js`. Each category and channel name includes its emoji as a Unicode character:

```javascript
{
  name: `\u2139\ufe0f\\u2502INFO`,
  children: [
    { name: `\ud83d\udccc\\u2502rules`, type: 0, topic: 'Server rules' },
  ]
}
```

Use any Unicode emoji. Colored emojis render as images on Discord. Outline symbols render as text.

### Spacing Convention

Every name follows: `emoji│name` using regular spaces and a box-drawing vertical bar (│).

Categories: `emoji NAME` (e.g., ☄️ GENERAL)
Channels: `emoji name` (e.g., 📌 rules)

The **box-drawing vertical bar (│)** is used as a visual separator between emoji and channel name. Regular spaces are used for multi-word names.

### Why This Format Works

- \u2502 separates emoji from text cleanly
- Regular spaces work fine everywhere — no font dependency issues
- Channel names like `\ud83d\udccc\u2502rules` look clean and consistent

---

## 8. Unicode and Emoji Reference

### Colored Emojis

| Emoji | Unicode | Character | Used For |
|-------|---------|-----------|----------|
| info source | U+2139 U+FE0F | ℹ️ | INFO category |
| pushpin | U+1F4CC | 📌 | rules |
| bell | U+1F514 | 🔔 | announcements |
| laptop | U+1F4BB | 💻 | product catalog |
| link | U+1F517 | 🔗 | links |
| comet | U+2604 U+FE0F | ☄️ | GENERAL category |
| star | U+2B50 | ⭐ | VERIFIED category |
| gem | U+1F48E | 💎 | verified chat |
| lock with key | U+1F510 | 🔐 | verified voice |
| black diamond minus white x | U+2756 | ❖ | SUPPORT category |
| eight pointed star | U+2734 | ✴ | STAFF category |
| shield | U+1F6E1 U+FE0F | 🛡️ | staff chat |
| envelope with arrow | U+1F4E8 | 📨 | order notifications |
| money bag | U+1F4B0 | 💰 | xmr addresses |
| white diamond | U+25C7 | ◇ | VOICE category |

### Outline Unicode Symbols

| Symbol | Unicode | Character | Used For |
|--------|---------|-----------|----------|
| fisheye | U+25C9 | ◉ | general chat, off topic |
| four pointed star | U+2726 | ✦ | open your ticket, ticket logs |
| right triangle | U+25B7 | ▷ | general voice, support voice |

### Box-Drawing Vertical Bar Separator (\u2502)

Every name follows: `emoji\u2502name` using regular spaces and a box-drawing vertical bar (\u2502).

**Why this works:**
- Regular spaces are normal — no special Unicode needed
- \u2502 creates a clean, consistent visual separator
- No font/rendering inconsistencies
- Looks identical across all platforms

**Usage in names:**
```
Category:  ℹ️│INFO        (emoji + bar + word)
Channel:   📌│rules       (emoji + bar + word)
Multi:     💻│product catalog  (emoji + bar + words)
```

**Regex handling:**
```javascript
// Remove emojis/symbols but keep spaces and bars
name.replace(/[^\w\s\u2502]/g, '')

// Remove bars, trim extra spaces for lookup
.replace(/\u2502/g, '').trim().replace(/\s+/g, ' ')
```


---
---

## 8b. Unicode Art Reference (Decorative Channels)

Decorative channels use pure Unicode art as the entire channel name. They serve as visual spacers in the sidebar — purely aesthetic, no functionality.

### Rules

- **Text channels**: NO spaces allowed in names
- **Voice channels**: CAN use spaces
- **Categories**: CAN use spaces, use \u2502 (fullwidth solidus) as spacer
- Decorative channels are always read-only (VIEW for everyone, SEND denied for all)
- Decorative channels are NOT added to lookup keys
- Mark them with `decor: true` in the config

### Header Art (top of category)

Used as the first channel in each category to create a visual header.

**Primary header (used in all categories):**
```
꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂
```
Ornate header with Egyptian/lotus motifs. Copy-paste this exact string as the channel name.

### Divider Art (bottom of category)

Used as the last channel in each category to create a visual separator.

**⚠️ Do NOT use dividers in categories with voice channels.** Discord forces voice channels below text channels, so dividers (text channels) will appear above voice channels, breaking the visual effect. Only use dividers in text-only categories.

**Primary divider (used in most categories):**
```
⫘⫘⫘⫘⫘⫘
```
Wave/tilde pattern.

**End divider (used at the very bottom of the sidebar):**
```
∘₊✧──────✧₊∘
```
Sparkle end divider. Used as the last channel in the Voice category (bottom of sidebar).

**Alternative end divider:**
```
▬▬ι════════ﺤ
```

### Spacers Between Channels

| Character | Unicode | Name | Use |
|-----------|---------|------|-----|
| │ | U+2502 | Box-drawing vertical bar | Channel separator: `emoji│name` |
| ／ | U+FF0F | Fullwidth solidus | Category separator: `emoji／NAME` |
| ⫘ | U+2574 | Box-drawing light left | Wave dividers |

### Rules

- **Categories**: CAN use spaces — `emoji／NAME`
- **Text channels**: CANNOT use spaces — `emoji│name`
- **Voice channels**: CAN use spaces — `emoji│voice name`
- **Decorative channels**: pure Unicode art as entire channel name, `decor: true`


## 9. Console Script Usage

### Running

1. Open any website, press F12, Console tab
2. Paste entire console-builder.js content
3. Press Enter
4. Enter Server ID when prompted (pre-filled with default)
5. Wait 5-15 seconds
6. Results appear in console, .env copies to clipboard

### Output Sections

- ROLES: all role names and IDs
- CATEGORIES: all category names and IDs
- CHANNELS: all channel names and IDs
- .env FILE: complete environment variables for main bot

### Error Messages

| Error | Fix |
|-------|-----|
| No Server ID. Aborted. | Re-run and enter a valid ID |
| Invalid secret | Check SECRET constant |
| Failed to decode bot token | Re-encode your bot token |
| 500 error | Check Vercel logs |

---

## 10. Environment Variables

### Generated .env Contents

```
# Discord Bot Credentials
DISCORD_APPLICATION_ID
DISCORD_APPLICATION_PUBLIC_KEY
DISCORD_BOT_TOKEN
DISCORD_GUILD_ID

# Role IDs
DISCORD_OWNER_ROLE_ID
DISCORD_SELLER_ROLE_ID
DISCORD_STAFF_ROLE_ID
DISCORD_CUSTOMER_ROLE_ID
DISCORD_MEMBER_ROLE_ID

# Channel IDs
DISCORD_RULES_CHANNEL_ID
DISCORD_ANNOUNCEMENTS_CHANNEL_ID
DISCORD_PRODUCT_CATALOG_CHANNEL_ID
DISCORD_LINKS_CHANNEL_ID
DISCORD_GENERAL_CHAT_CHANNEL_ID
DISCORD_OFF_TOPIC_CHANNEL_ID
DISCORD_VERIFIED_CHAT_CHANNEL_ID
DISCORD_VERIFIED_VOICE_CHANNEL_ID
DISCORD_TICKET_PANEL_CHANNEL_ID
DISCORD_TICKET_LOG_CHANNEL_ID
DISCORD_STAFF_CHAT_CHANNEL_ID
DISCORD_ORDER_NOTIFICATION_CHANNEL_ID
DISCORD_XMR_ADDRESSES_CHANNEL_ID
DISCORD_GENERAL_VOICE_CHANNEL_ID
DISCORD_SUPPORT_VOICE_CHANNEL_ID

# Secrets
PANEL_SECRET
SETUP_SECRET
UPDATE_LINKS_SECRET
UPDATE_PRICING_SECRET

# Constants
XMR_RATE_USD
TICKET_SERVER_INVITE
PRODUCT_SERVER_INVITE
SELLER_WEBSITE
OFFICIAL_WEBSITE
```

---

## 11. HunteRoi Fork Reference

### Original Library

The HunteRoi discord-server-generator provides:
- ServerGeneratorManager class
- JSON-based server configuration
- PurgeEngine for cleaning existing structures
- ContentDeploymentEngine for posting messages
- PermissionEngine for role-based permissions
- InteractionHandlerRegistry for button/select handlers

### What the Fork Introduced

**Extended Schema:**
- messages[] on channel blueprints
- initial_threads[] on channel blueprints
- permissionBlueprint for role-based permission presets
- buttonHandlers[] for custom button interactions
- selectHandlers[] for custom select menu interactions

**PurgeEngine improvements:**
- Rate-limit safe deletion
- Bottom-up channel ordering
- Lowest-first role ordering
- Protected role skipping (@everyone, managed)

**ContentDeploymentEngine:**
- Posts rich embeds with fields, images, footers
- Handles component rows (buttons, select menus)
- Creates initial threads
- Rate-limited posting

**PermissionEngine:**
- Computes permission bitfields from role definitions
- Category-level permission blueprints
- Permission inheritance from categories to channels
- Per-channel overrides

**InteractionHandlerRegistry:**
- Button click handlers (custom_id based)
- Select menu handlers
- Ticket creation flow
- Role assignment toggles
- URL redirect buttons

### Fork vs Builder Bot

| Feature | HunteRoi Fork | Builder Bot |
|---------|---------------|-------------|
| Runtime | Discord.js Gateway (persistent) | Vercel serverless (stateless) |
| Trigger | Slash commands | Browser console |
| Dependencies | discord.js, npm packages | None (pure fetch) |
| Messages | Posts embeds | Does not post |
| Schema | TypeScript interfaces | JavaScript config |
| Events | Emits guildGenerate, etc. | Returns JSON |

The builder bot chose REST-only because Vercel does not support persistent WebSocket connections.

---

## 12. API Reference

### POST /api/builder

**Request:**
```json
{
  "secret": "ambrosia-build-2026",
  "guild_id": "1539404742055166045"
}
```

**Success Response:**
```json
{
  "success": true,
  "time": "8.5s",
  "guild_id": "...",
  "roles": { "Owner": "...", "Seller": "...", ... },
  "categories": { "info": "...", "general": "...", ... },
  "channels": { "rules": "...", "announcements": "...", ... }
}
```

**Status Codes:** 200 success, 400 missing guild_id, 403 invalid secret, 405 not POST, 500 server error

### Discord API Calls

Approximately 40-50 calls total:
1. GET channels + GET roles (2 calls)
2. DELETE channels + categories + roles (20-40 calls)
3. POST create 5 roles (5 calls)
4. PATCH reorder roles (1 call)
5. POST create 6 categories (6 calls)
6. POST create 15 channels (15 calls)

---

## 13. Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Bot gets 403 errors | Lacks Administrator | Re-invite with Admin permission |
| Function times out | Too many channels to delete | Try again, rate limits are temporary |
| Empty categories appear | Previous build interrupted | Run builder again |
| Roles in wrong order | PATCH reorder failed | Run builder again |
| .env has empty values | Channel/role creation failed | Check Vercel logs for errors |
| Channels without categories | Category creation failed | Check bot permissions |
| Verified channels visible to all | Permission overwrites failed | Run builder again |

---

## 14. Security Notes

- Bot token is hardcoded in source (not in env vars)
- The builder endpoint requires a secret key
- The builder bot should be removed from the server after use
- The main bot uses the extracted IDs from the .env file
- Never share bot tokens publicly

---

## 15. Discord Permission Bit Reference

### General Permissions (Guild-wide)

| Permission | Bit | Value | Hex | Description |
|------------|-----|-------|-----|-------------|
| CREATE_INSTANT_INVITE | 1 << 0 | 1 | 0x1 | Create instant invites |
| KICK_MEMBERS * | 1 << 1 | 2 | 0x2 | Kick members |
| BAN_MEMBERS * | 1 << 2 | 4 | 0x4 | Ban members |
| ADMINISTRATOR * | 1 << 3 | 8 | 0x8 | All permissions, bypass channel overwrites |
| MANAGE_CHANNELS * | 1 << 4 | 16 | 0x10 | Edit channels |
| MANAGE_GUILD * | 1 << 5 | 32 | 0x20 | Edit guild |
| ADD_REACTIONS | 1 << 6 | 64 | 0x40 | Add reactions to messages |
| VIEW_AUDIT_LOG | 1 << 7 | 128 | 0x80 | View audit log |
| PRIORITY_SPEAKER | 1 << 8 | 256 | 0x100 | Use priority speaker in voice |
| STREAM | 1 << 9 | 512 | 0x200 | Go live / stream |
| VIEW_CHANNEL | 1 << 10 | 1024 | 0x400 | View channel (read messages, join voice) |
| VIEW_GUILD_INSIGHTS | 1 << 19 | 524288 | 0x80000 | View guild insights |

### Text Permissions

| Permission | Bit | Value | Hex | Description |
|------------|-----|-------|-----|-------------|
| SEND_MESSAGES | 1 << 11 | 2048 | 0x800 | Send messages in channels |
| SEND_TTS_MESSAGES | 1 << 12 | 4096 | 0x1000 | Send /tts messages |
| MANAGE_MESSAGES * | 1 << 13 | 8192 | 0x2000 | Delete other users' messages |
| EMBED_LINKS | 1 << 14 | 16384 | 0x4000 | Links auto-embed |
| ATTACH_FILES | 1 << 15 | 32768 | 0x8000 | Upload images and files |
| READ_MESSAGE_HISTORY | 1 << 16 | 65536 | 0x10000 | Read message history |
| MENTION_EVERYONE | 1 << 17 | 131072 | 0x20000 | Use @everyone and @here |
| USE_EXTERNAL_EMOJIS | 1 << 18 | 262144 | 0x40000 | Use custom emojis from other servers |
| USE_EXTERNAL_STICKERS | 1 << 37 | 137438953472 | 0x20000000000 | Use stickers from other servers |
| SEND_MESSAGES_IN_THREADS | 1 << 38 | 274877906944 | 0x40000000000 | Send messages in threads |
| PIN_MESSAGES | 1 << 51 | 2251799813685248 | 0x8000000000000 | Pin and unpin messages |
| SEND_POLLS | 1 << 49 | 562949953421312 | 0x2000000000000 | Send polls |
| SEND_VOICE_MESSAGES | 1 << 46 | 70368744177664 | 0x400000000000 | Send voice messages |
| BYPASS_SLOWMODE | 1 << 52 | 4503599627370496 | 0x10000000000000 | Bypass slowmode restrictions |

### Voice Permissions

| Permission | Bit | Value | Hex | Description |
|------------|-----|-------|-----|-------------|
| CONNECT | 1 << 20 | 1048576 | 0x100000 | Join voice channel |
| SPEAK | 1 << 21 | 2097152 | 0x200000 | Speak in voice channel |
| MUTE_MEMBERS | 1 << 22 | 4194304 | 0x400000 | Mute members in voice |
| DEAFEN_MEMBERS | 1 << 23 | 8388608 | 0x800000 | Deafen members in voice |
| MOVE_MEMBERS | 1 << 24 | 16777216 | 0x1000000 | Move members between voice channels |
| USE_VAD | 1 << 25 | 33554432 | 0x2000000 | Use voice activity detection |
| USE_EMBEDDED_ACTIVITIES | 1 << 39 | 549755813888 | 0x80000000000 | Use Activities in voice |
| USE_SOUNDBOARD | 1 << 42 | 4398046511104 | 0x400000000000 | Use soundboard in voice |
| USE_EXTERNAL_SOUNDS | 1 << 45 | 35184372088832 | 0x2000000000000 | Use custom sounds from other servers |
| SET_VOICE_CHANNEL_STATUS | 1 << 48 | 281474976710656 | 0x1000000000000 | Set voice channel status |

### Stage Permissions

| Permission | Bit | Value | Hex | Description |
|------------|-----|-------|-----|-------------|
| REQUEST_TO_SPEAK | 1 << 32 | 4294967296 | 0x100000000 | Request to speak in stage |

### Thread Permissions

| Permission | Bit | Value | Hex | Description |
|------------|-----|-------|-----|-------------|
| MANAGE_THREADS * | 1 << 34 | 17179869184 | 0x400000000 | Delete/archive threads, view private threads |
| CREATE_PUBLIC_THREADS | 1 << 35 | 34359738368 | 0x800000000 | Create public and announcement threads |
| CREATE_PRIVATE_THREADS | 1 << 36 | 68719476736 | 0x1000000000 | Create private threads |

### Management Permissions

| Permission | Bit | Value | Hex | Description |
|------------|-----|-------|-----|-------------|
| MANAGE_ROLES * | 1 << 28 | 268435456 | 0x10000000 | Edit roles |
| MANAGE_NICKNAMES | 1 << 27 | 134217728 | 0x8000000 | Edit other users' nicknames |
| CHANGE_NICKNAME | 1 << 26 | 67108864 | 0x4000000 | Edit own nickname |
| MANAGE_WEBHOOKS * | 1 << 29 | 536870912 | 0x20000000 | Edit webhooks |
| MANAGE_GUILD_EXPRESSIONS * | 1 << 30 | 1073741824 | 0x40000000 | Edit/delete emojis, stickers, soundboard sounds |
| CREATE_GUILD_EXPRESSIONS | 1 << 43 | 8796093022208 | 0x800000000000 | Create emojis, stickers, soundboard sounds |
| MANAGE_EVENTS | 1 << 33 | 8589934592 | 0x200000000 | Edit/delete scheduled events |
| CREATE_EVENTS | 1 << 44 | 17592186044416 | 0x100000000000 | Create scheduled events |
| MODERATE_MEMBERS ** | 1 << 40 | 1099511627776 | 0x10000000000 | Timeout members |

### Special Permissions

| Permission | Bit | Value | Hex | Description |
|------------|-----|-------|-----|-------------|
| USE_APPLICATION_COMMANDS | 1 << 31 | 2147483648 | 0x80000000 | Use slash commands and context menus |
| VIEW_CREATOR_MONETIZATION_ANALYTICS * | 1 << 41 | 2199023255552 | 0x20000000000 | View role subscription insights |
| USE_EXTERNAL_APPS | 1 << 50 | 1125899906842624 | 0x4000000000000 | User-installed apps send public responses |

### Permission Summary Table

| Bit | Value | Permission |
|-----|-------|------------|
| 0 | 1 | CREATE_INSTANT_INVITE |
| 1 | 2 | KICK_MEMBERS |
| 2 | 4 | BAN_MEMBERS |
| 3 | 8 | ADMINISTRATOR |
| 4 | 16 | MANAGE_CHANNELS |
| 5 | 32 | MANAGE_GUILD |
| 6 | 64 | ADD_REACTIONS |
| 7 | 128 | VIEW_AUDIT_LOG |
| 8 | 256 | PRIORITY_SPEAKER |
| 9 | 512 | STREAM |
| 10 | 1024 | VIEW_CHANNEL |
| 11 | 2048 | SEND_MESSAGES |
| 12 | 4096 | SEND_TTS_MESSAGES |
| 13 | 8192 | MANAGE_MESSAGES |
| 14 | 16384 | EMBED_LINKS |
| 15 | 32768 | ATTACH_FILES |
| 16 | 65536 | READ_MESSAGE_HISTORY |
| 17 | 131072 | MENTION_EVERYONE |
| 18 | 262144 | USE_EXTERNAL_EMOJIS |
| 19 | 524288 | VIEW_GUILD_INSIGHTS |
| 20 | 1048576 | CONNECT |
| 21 | 2097152 | SPEAK |
| 22 | 4194304 | MUTE_MEMBERS |
| 23 | 8388608 | DEAFEN_MEMBERS |
| 24 | 16777216 | MOVE_MEMBERS |
| 25 | 33554432 | USE_VAD |
| 26 | 67108864 | CHANGE_NICKNAME |
| 27 | 134217728 | MANAGE_NICKNAMES |
| 28 | 268435456 | MANAGE_ROLES |
| 29 | 536870912 | MANAGE_WEBHOOKS |
| 30 | 1073741824 | MANAGE_GUILD_EXPRESSIONS |
| 31 | 2147483648 | USE_APPLICATION_COMMANDS |
| 32 | 4294967296 | REQUEST_TO_SPEAK |
| 33 | 8589934592 | MANAGE_EVENTS |
| 34 | 17179869184 | MANAGE_THREADS |
| 35 | 34359738368 | CREATE_PUBLIC_THREADS |
| 36 | 68719476736 | CREATE_PRIVATE_THREADS |
| 37 | 137438953472 | USE_EXTERNAL_STICKERS |
| 38 | 274877906944 | SEND_MESSAGES_IN_THREADS |
| 39 | 549755813888 | USE_EMBEDDED_ACTIVITIES |
| 40 | 1099511627776 | MODERATE_MEMBERS |
| 41 | 2199023255552 | VIEW_CREATOR_MONETIZATION_ANALYTICS |
| 42 | 4398046511104 | USE_SOUNDBOARD |
| 43 | 8796093022208 | CREATE_GUILD_EXPRESSIONS |
| 44 | 17592186044416 | CREATE_EVENTS |
| 45 | 35184372088832 | USE_EXTERNAL_SOUNDS |
| 46 | 70368744177664 | SEND_VOICE_MESSAGES |
| 48 | 281474976710656 | SET_VOICE_CHANNEL_STATUS |
| 49 | 562949953421312 | SEND_POLLS |
| 50 | 1125899906842624 | USE_EXTERNAL_APPS |
| 51 | 2251799813685248 | PIN_MESSAGES |
| 52 | 4503599627370496 | BYPASS_SLOWMODE |

*\* Requires 2FA when guild has server-wide 2FA enabled*
*\*\* Timeout permission - temporarily revokes all permissions except VIEW_CHANNEL and READ_MESSAGE_HISTORY*

---

## 16. Channel Flags

Channel flags are bitfield values set on the `flags` property of a channel object.

### Available Flags

| Flag | Bit | Value | Description |
|------|-----|-------|-------------|
| PINNED | 1 << 1 | 2 | Thread is pinned to top of forum/media channel |
| REQUIRE_TAG | 1 << 4 | 16 | Forum/media requires a tag when creating thread |
| HIDE_MEDIA_DOWNLOAD_OPTIONS | 1 << 15 | 32768 | Hides embedded media download options |
| CHANNEL_OBFUSCATED | 1 << 17 | 131072 | Channel metadata is obfuscated (gateway only) |
| IS_SPOILER_CHANNEL | 1 << 21 | 2097152 | Channel is hidden behind spoiler overlay |

### Setting Flags Programmatically

```javascript
// Single flag
chPayload.flags = (1 << 21).toString();

// Multiple flags (bitwise OR)
chPayload.flags = ((1 << 1) | (1 << 21)).toString();
```

---

## 17. Private Channels (Two Types)

Discord has two different "private channel" features. They look similar but work differently.

### Type 1: Spoiler Channel (IS_SPOILER_CHANNEL flag)

The `IS_SPOILER_CHANNEL` flag (1 << 21) makes a channel appear hidden behind a spoiler overlay. Users must click to reveal the channel name and topic.

**How it works:**
- Visual only — hides channel name behind blur
- Does NOT affect permissions
- Anyone with VIEW_CHANNEL can still access it
- User must click to reveal

**How to use in the builder:**
```javascript
// In CONFIG.categories[].children[], add private: true
{
  name: `🛡️ private channel`,
  type: 0,
  topic: 'Hidden topic',
  private: true  // <-- sets IS_SPOILER_CHANNEL flag
}
```

**Best for:** Channels you want hidden but not permission-restricted.

### Type 2: Permission-Private Channel (Member Overwrites)

This is the native Discord "Private Channel" feature — right-click a channel, "Edit Channel" > "Permissions", then select specific members and roles who can see it. It works by setting **permission overwrites** at the member level (type 1) and role level (type 0).

**How it works:**
- Deny VIEW_CHANNEL for @everyone
- Allow VIEW_CHANNEL for specific roles and members
- Only those roles/members can see the channel
- This is what Discord's "Make Private" button does

**How the builder handles it:**

The builder already creates permission-private channels using role overwrites (type 0). For example, the "Verified" and "Staff" categories deny VIEW for lower roles.

To add **member-specific** overwrites (like Discord's "Make Private" button), you need to add type 1 overwrites after the builder runs:

```javascript
// Add member-specific overwrites via Discord API
PATCH /channels/{channel_id}
{
  "permission_overwrites": [
    // Existing role overwrites (type 0)
    { "id": "@everyone_id", "type": 0, "allow": "0", "deny": "1024" },
    { "id": "role_id", "type": 0, "allow": "1024", "deny": "0" },
    
    // Member-specific overwrite (type 1) — THIS IS THE PRIVATE CHANNEL PART
    { "id": "member_user_id", "type": 1, "allow": "1024", "deny": "0" }
  ]
}
```

**Overwrite Types:**

| Type | Value | Applies To |
|------|-------|------------|
| Role | 0 | Everyone with that role |
| Member | 1 | Specific user only |

**Best for:** Channels only specific people should see (DM-like channels, personal project channels, secret info).

### How Discord's "Make Private" Button Works

When you click "Make Private" in Discord's channel settings, it:

1. Sets deny VIEW_CHANNEL for @everyone (type 0)
2. Keeps allow VIEW_CHANNEL for roles you select
3. Adds allow VIEW_CHANNEL for specific members you select (type 1)
4. The channel becomes invisible to everyone not in the allowed list

### Extending the Builder for Member-Private Channels

To support member-specific overwrites in the builder, add a `members` array to channel config:

```javascript
// In CONFIG.categories[].children[]
{
  name: `🔒 secret channel`,
  type: 0,
  topic: 'Only these people can see this',
  private: true,
  members: ['USER_ID_1', 'USER_ID_2']  // <-- member-specific overwrites
}
```

Then in the channel creation code:

```javascript
const chPayload = {
  name: chDef.name, type: chDef.type, parent_id: cat.id,
  topic: chDef.topic || undefined,
  permission_overwrites: chPerms(roleIds, chDef)
};

// Add member-specific overwrites
if (chDef.members) {
  for (const memberId of chDef.members) {
    chPayload.permission_overwrites.push({
      id: memberId,
      type: 1,  // member overwrite
      allow: (1024n).toString(),  // VIEW_CHANNEL
      deny: '0'
    });
  }
}

if (chDef.private) chPayload.flags = (1 << 21).toString();
```

### Comparison

| Feature | Spoiler Channel | Permission-Private Channel |
|---------|-----------------|---------------------------|
| How it works | IS_SPOILER_CHANNEL flag | Permission overwrites |
| Who can see | Anyone with VIEW_CHANNEL | Only allowed roles/members |
| Visual effect | Spoiler blur overlay | Channel hidden from list |
| Affects permissions | No | Yes |
| Discord UI equivalent | None (API only) | "Make Private" button |
| Use case | Hidden but accessible | Truly private |

---

## 18. Source Code Walkthrough

### builder.js (Serverless Function)

**Token Handling (lines 1-8):**
- Token stored as base64 string `ENCODED_BOT_TOKEN`
- Decoded at runtime using `Buffer.from(encoded, 'base64').toString('utf8')`
- Never exposes raw token in source code

**Rate Limiting (lines 14-29):**
- Tracks `rateLimitReset` timestamp
- Waits before requests if rate limit is active
- Retries on 429 responses with `retry-after` header
- Adds 50-300ms buffer after rate limit expires

**Permission Bit Helper (lines 31-38):**
- `bit()` function combines permission flags using bitwise OR
- All permissions defined as BigInt literals for 64-bit support
- Permission constants: VIEW, SEND, EMBED, ATTACH, MANAGE_CH, MANAGE_MSG, MENTION, KICK, BAN, ADMIN, MANAGE_ROLES, CHANGE_NICK, CONNECT, SPEAK

**Channel Permission Logic (lines 97-159):**
- `chPerms()` function determines overwrites per channel
- Channel type detected by name keywords: isRead, isHidden, isExclusive, isVoice
- Uses `\\u2502` (pipe separator) in name matching for multi-word channels
- Role index (0-4) determines permission level
- @everyone gets base permissions based on channel type
- Each role gets specific allow/deny based on channel type and role hierarchy
- Customize the name-matching keywords in `chPerms()` for your channels

**Main Handler (lines 161-248):**
- Validates request method (POST only)
- Checks secret key
- Fetches all channels and roles in parallel
- Deletes channels bottom-up (highest position first)
- Deletes categories after channels
- Deletes non-@everyone, non-managed roles
- Waits 1 second for Discord cache to clear
- Creates roles in order (Owner first, Member last)
- Reorders roles via PATCH endpoint
- Creates categories with permission overwrites
- Creates channels under each category
- Sets `flags` field for private channels (IS_SPOILER_CHANNEL)
- Returns JSON with all IDs

### console-builder.js (Browser Script)

**Configuration (lines 2-6):**
- BUILDER_URL: Vercel serverless function endpoint
- SECRET: authentication key
- BOT_TOKEN: encoded token for .env generation
- APP_ID: Discord application ID
- PUB_KEY: Discord public key

**User Input (lines 8-13):**
- Prompts for Server ID using browser `prompt()`
- Pre-fills with default guild ID
- Validates non-empty input
- Trims whitespace

**API Call (lines 18-28):**
- Sends POST request to builder endpoint
- Includes secret and guild_id in body
- Handles error responses

**Output Formatting (lines 30-51):**
- Prints roles, categories, channels in sections
- Filters out category entries from channel list
- Formats as `key: value` pairs

**.env Generation (lines 56-104):**
- Maps role names to environment variable names
- Maps channel names to environment variable names
- Includes all secrets and constants
- Copies to clipboard using `navigator.clipboard.writeText()`

---

## 19. Permission Calculation Algorithm

### Channel Type Detection

The `chPerms()` function detects channel type by name matching:

```
isRead = name contains "rules" OR "announcements" OR "catalog" OR "links"
isHidden = name contains "logs" OR "chat" OR "notifications" OR "addresses" OR "staff"
isVerified = name contains "verified" OR "exclusive" OR "vip"
isVoice = channel type === 2
```

Customize these keywords in `chPerms()` to match your channel names.

### Base Permissions (@everyone)

| Channel Type | Allow | Deny |
|--------------|-------|------|
| Read-only | VIEW | SEND |
| Hidden | - | VIEW |
| Exclusive | - | VIEW |
| Voice | VIEW, CONNECT | - |
| Normal | VIEW, SEND | - |

### Role Permission Rules (by index)

**Role 0 (top, admin):** Always gets full management permissions

**Role 1 (management):**
- Hidden/Exclusive channels: VIEW, SEND, EMBED, ATTACH, MANAGE_MSG
- Other channels: VIEW, SEND, EMBED, ATTACH

**Role 2 (moderation):**
- All channels: VIEW, SEND, EMBED, ATTACH

**Role 3 (trusted):**
- Exclusive channels: VIEW, SEND, EMBED, ATTACH
- Hidden channels: deny VIEW
- Read-only channels: VIEW only
- Normal channels: VIEW, SEND, EMBED, ATTACH

**Role 4 (bottom, member):**
- Exclusive/Hidden channels: deny VIEW
- Read-only channels: VIEW only
- Normal channels: VIEW, SEND, EMBED, ATTACH

---

## 20. Delay Strategy

### Why Delays Matter

Discord's API has rate limits and eventual consistency. Without delays:
- Deleted channels might still appear when creating new ones
- Role positions might not update correctly
- Permission overwrites might not apply

### Delay Sequence

| Step | Delay | Purpose |
|------|-------|---------|
| After each channel delete | 100ms | Avoid rate limits |
| After each role delete | 100ms | Avoid rate limits |
| After all deletions | 1000ms | Wait for cache clear |
| After each role create | 150ms | Avoid rate limits |
| After role reorder | 300ms | Wait for position update |
| After each channel create | 100ms | Avoid rate limits |

### Total Estimated Time

- Deletion phase: ~3-5 seconds (30-40 items x 100ms)
- Wait: 1 second
- Creation phase: ~3-4 seconds (26 items x 150ms)
- **Total: ~7-10 seconds**

---

## 21. Lookup Key Generation

### Purpose

Console script needs to map channel names to environment variable names. Example:
- `📢 announcements` -> `announcements` -> `DISCORD_ANNOUNCEMENTS_CHANNEL_ID`

### Algorithm

```javascript
plainName = name
  .replace(/[^\w\s\\u2502]/g, '')  // Remove emojis/symbols, keep pipe separators
  .replace(/\\u2502/g, ' ')        // Convert pipe separators to regular spaces
  .trim()                          // Remove leading/trailing spaces
  .replace(/\s+/g, ' ')           // Collapse multiple spaces to single
  .toLowerCase();                  // Convert to lowercase
```

### Examples

| Original Name | After Regex | After Braille | After Trim | Result |
|---------------|-------------|---------------|------------|--------|
| `ℹ️ INFO` | ` INFO` | ` INFO` | `INFO` | `info` |
| `📢 announcements` | ` announcements` | ` announcements` | `announcements` | `announcements` |
| `◉ general chat` | ` general chat` | ` general chat` | `general chat` | `general chat` |
| `💎 verified chat` | ` verified chat` | ` verified chat` | `verified chat` | `verified chat` |

### Mapping to Environment Variables

The console script automatically maps lookup keys to environment variable names. Customize this mapping in `console-builder.js`:

```javascript
// Role mapping (edit in console-builder.js)
'Owner' -> 'DISCORD_OWNER_ROLE_ID'
'Seller' -> 'DISCORD_SELLER_ROLE_ID'
'Staff' -> 'DISCORD_STAFF_ROLE_ID'
'Verified Customer' -> 'DISCORD_CUSTOMER_ROLE_ID'
'Member' -> 'DISCORD_MEMBER_ROLE_ID'

// Channel mapping (edit in console-builder.js)
'rules' -> 'DISCORD_RULES_CHANNEL_ID'
'announcements' -> 'DISCORD_ANNOUNCEMENTS_CHANNEL_ID'
'product catalog' -> 'DISCORD_PRODUCT_CATALOG_CHANNEL_ID'
'links' -> 'DISCORD_LINKS_CHANNEL_ID'
'general chat' -> 'DISCORD_GENERAL_CHAT_CHANNEL_ID'
'off topic' -> 'DISCORD_OFF_TOPIC_CHANNEL_ID'
'verified chat' -> 'DISCORD_VERIFIED_CHAT_CHANNEL_ID'
'verified voice' -> 'DISCORD_VERIFIED_VOICE_CHANNEL_ID'
'open your ticket' -> 'DISCORD_TICKET_PANEL_CHANNEL_ID'
'ticket logs' -> 'DISCORD_TICKET_LOG_CHANNEL_ID'
'staff chat' -> 'DISCORD_STAFF_CHAT_CHANNEL_ID'
'order notifications' -> 'DISCORD_ORDER_NOTIFICATION_CHANNEL_ID'
'xmr addresses' -> 'DISCORD_XMR_ADDRESSES_CHANNEL_ID'
'general voice' -> 'DISCORD_GENERAL_VOICE_CHANNEL_ID'
'support voice' -> 'DISCORD_SUPPORT_VOICE_CHANNEL_ID'
```

Update these mappings whenever you change channel or role names in `CONFIG`.

---

## 22. Integration with Your Bot

### Data Flow

```
Builder Bot
    | creates structure
    | returns IDs
    v
Console Script
    | generates .env
    v
Your Bot
    | uses IDs for:
    +-- Sending messages/embeds
    +-- Permission checks
    +-- Role assignment
    +-- Channel management
    +-- Ticket systems
```

### How IDs Are Used

| ID Type | Purpose |
|---------|---------|
| Role IDs | Permission checks, role assignment, member sorting |
| Channel IDs | Sending messages, embeds, notifications |
| Guild ID | All Discord API calls |

### Using the IDs

Copy the generated .env values into your bot's environment variables. Then reference them in your code:

```javascript
// Discord.js example
const channel = await client.channels.fetch(process.env.DISCORD_GENERAL_CHAT_CHANNEL_ID);
await channel.send('Hello world!');

// Permission check
const member = await guild.members.fetch(userId);
if (member.roles.cache.has(process.env.DISCORD_STAFF_ROLE_ID)) {
  // User is staff
}
```

### Pairing with Other Bots

The builder creates the structure. Pair it with:
- **Discord.js / discord.py** bot for custom logic
- **Ticket bot** for support systems
- **Moderation bot** for auto-mod
- **Welcome bot** for onboarding
- **Music bot** for voice channels

---

## 23. Development Guide

### Local Development

1. Clone the repository
2. Run `vercel dev` to start local server
3. Test endpoints at `http://localhost:3000/api/builder`

### Testing the Builder

1. Create a test server
2. Invite the builder bot with Administrator
3. Run console script with test server ID
4. Verify all roles, categories, channels created
5. Check permissions match documentation

### Common Modifications

**Adding a new channel:**
1. Add to `CONFIG.categories[].children[]` in builder.js
2. Add permission logic in `chPerms()` function
3. Add lookup mapping in console-builder.js
4. Update documentation

**Changing permissions:**
1. Modify `chPerms()` function in builder.js
2. Update permission matrix in documentation
3. Test all channel types

**Adding a new role:**
1. Add to `CONFIG.roles[]` in builder.js
2. Update position assignments
3. Add permission logic in `chPerms()` for new role index
4. Update console-builder.js .env generation
5. Update documentation

**Making a channel private:**
1. Add `private: true` to the channel config
2. The builder sets IS_SPOILER_CHANNEL flag automatically
3. Combine with permission overwrites if needed

### Vercel Environment Variables

Set in Vercel dashboard:
- `BUILDER_BOT_TOKEN` (optional, defaults to hardcoded value)

---

## 24. File Reference

### builder-bot/ Directory

| File | Purpose | Lines |
|------|---------|-------|
| `api/builder.js` | Serverless builder function | 248 |
| `console-builder.js` | Browser console trigger script | 121 |
| `index.html` | Landing page | - |
| `styles.css` | Website styling | - |
| `app.js` | Frontend logic | - |
| `package.json` | Dependencies (none required) | - |
| `README.md` | Quick start guide | - |
| `DOCUMENTATION.md` | This file | - |

### Key Functions in builder.js

| Function | Purpose |
|----------|---------|
| `decodeToken()` | Decodes base64 bot token |
| `getHeaders()` | Returns auth headers for Discord API |
| `api()` | Makes rate-limit-safe Discord API calls |
| `bit()` | Combines permission flags |
| `chPerms()` | Calculates channel permission overwrites |
| `handler()` | Main serverless function entry point |

### Key Variables in console-builder.js

| Variable | Purpose |
|----------|---------|
| `BUILDER_URL` | Vercel endpoint URL |
| `SECRET` | Authentication key |
| `BOT_TOKEN` | Encoded token for .env |
| `APP_ID` | Discord application ID |
| `PUB_KEY` | Discord public key |
| `GUILD_ID` | User-provided server ID |

---

## 25. Frequently Asked Questions

### General

**Q: Do I need to install anything?**
A: No. The builder bot runs entirely in the browser and on Vercel. No npm install, no Node.js, no dependencies.

**Q: Can I run the builder multiple times?**
A: Yes. Each run purges the entire server first (all channels, categories, and non-default roles), then rebuilds from scratch. Safe to run repeatedly.

**Q: Does it delete @everyone?**
A: No. The @everyone role is protected and never deleted. Only custom roles are removed.

**Q: What happens if the builder times out?**
A: Vercel has a 10-second limit. If it times out, some items may be partially created. Run it again — it will purge everything and start fresh.

**Q: Can I use this on a server that already has channels?**
A: Yes, but it will delete everything. All existing channels, categories, and non-default roles will be removed.

**Q: Does it work on multiple servers?**
A: Yes. Enter any Server ID when prompted. The builder creates the structure in whatever server the bot has access to.

### Permissions

**Q: Why does the bot need Administrator?**
A: Administrator is required to: create/delete channels, create/delete roles, modify role positions, set permission overwrites. Without it, the builder cannot function.

**Q: Can I customize permissions?**
A: Yes. Edit the `chPerms()` function in builder.js and the `CONFIG` object. See Section 22 for details.

**Q: Why are lower roles denied VIEW on hidden channels?**
A: This ensures staff-only channels (logs, staff chat, notifications) remain invisible to regular users. Customize which channels are "hidden" in `chPerms()`.

**Q: Why does the trusted role get CHANGE_NICKNAME?**
A: Trusted members can set their own nickname for identification. You can change this permission in the role config.

### Private Channels

**Q: What does `private: true` do?**
A: Sets the IS_SPOILER_CHANNEL flag (1 << 21). The channel appears hidden behind a spoiler overlay until clicked.

**Q: Does `private: true` affect permissions?**
A: No. It only affects the visual presentation. You still need permission overwrites to control who can actually access the channel.

**Q: Can I combine `private: true` with permission overwrites?**
A: Yes. Use both for maximum security — the channel is visually hidden AND permission-restricted.

### Technical

**Q: Why is the token base64-encoded?**
A: Prevents casual exposure if source code is viewed. Not true security — the token is still in the source — but prevents accidental logging.

**Q: Why use Buffer.from() instead of atob()?**
A: Vercel's Node.js runtime does not provide `atob()`. `Buffer.from()` is the Node.js equivalent.

**Q: Why wait 1 second after deletion?**
A: Discord's API has eventual consistency. Deleted items may still appear in cache briefly. The delay ensures clean state before creation.

**Q: Why does the role reorder use PATCH instead of individual PUT calls?**
A: PATCH /guilds/{id}/roles accepts an array of {id, position} pairs and reorders all roles in one request. More efficient than updating each role individually.

**Q: Can I deploy this to something other than Vercel?**
A: Yes. Any platform that supports Node.js serverless functions works (Netlify Functions, AWS Lambda, Cloudflare Workers). You may need to adjust the file structure.

---

## 26. Edge Cases and Error Handling

### Partial Failures

| Scenario | Behavior |
|----------|----------|
| Channel delete fails | Continues (caught by `.catch(() => null)`) |
| Role delete fails | Continues (caught by `.catch(() => null)`) |
| Role create fails | That role ID is missing from lookup |
| Category create fails | All channels in that category are skipped |
| Channel create fails | That channel ID is missing from lookup |
| Role reorder fails | Roles remain in creation order |
| Rate limit hit | Waits for `retry-after` header, then retries |

### Missing IDs in .env

If a role or channel fails to create, its ID will be empty in the generated .env. The main bot will fail to send messages or check permissions for that item. Run the builder again to fix.

### Concurrent Runs

If two people run the builder on the same server simultaneously, both will try to delete and create the same items, causing race conditions. Only run the builder once at a time per server.

### Bot Removed Mid-Build

If the builder bot is kicked from the server during execution, subsequent API calls will return 403. The server will be left in a partially purged state. Re-invite the bot and run again.

---

## 27. Discord API Quirks

### Channel Type Values

| Type | Value | Description |
|------|-------|-------------|
| GUILD_TEXT | 0 | Text channel |
| GUILD_VOICE | 2 | Voice channel |
| GUILD_CATEGORY | 4 | Category (parent container) |

### Permission Overwrite Types

| Type | Value | Description |
|------|-------|-------------|
| Role | 0 | Overwrite applies to a role |
| Member | 1 | Overwrite applies to a specific member |

The builder uses type 0 (role) for all overwrites.

### Role Position Rules

- Higher position = higher in the list
- Position 1 = top of the list
- @everyone always exists at position 0 (can't be moved)
- Managed roles (bot roles, integration roles) can't be reordered
- Multiple roles can share the same position (Discord sorts them alphabetically)

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| DELETE /channels/{id} | 50 | per guild per 5 seconds |
| POST /guilds/{id}/channels | 50 | per guild per 5 seconds |
| POST /guilds/{id}/roles | 50 | per guild per 5 seconds |
| PATCH /guilds/{id}/roles | 50 | per guild per 5 seconds |

The builder adds 100-300ms delays between calls to stay well under limits.

### Permission Syncing

When a channel is created under a category, it inherits the category's permission overwrites. The builder then applies channel-specific overwrites that override the inherited ones.

---

## 28. Maintenance and Updates

### Changing the Bot Token

1. Go to Discord Developer Portal
2. Bot tab -> Reset Token
3. Copy new token
4. Base64-encode it: `echo -n "new_token" | base64`
5. Update `ENCODED_BOT_TOKEN` in builder.js
6. Update `BOT_TOKEN` in console-builder.js
7. Redeploy to Vercel

### Changing the Builder Secret

1. Open builder.js
2. Find `body.secret !== 'ambrosia-build-2026'`
3. Change to your new secret
4. Open console-builder.js
5. Find `var SECRET = 'ambrosia-build-2026'`
6. Change to match
7. Redeploy to Vercel

### Updating the Server Structure

1. Edit `CONFIG` object in builder.js
2. Update `chPerms()` if permission logic changes
3. Update console-builder.js .env generation if channels are added/removed
4. Update documentation
5. Redeploy to Vercel
6. Run builder on server to apply changes

### Adding a New Channel

1. Add to `CONFIG.categories[].children[]`:
```javascript
{ name: `emoji channel name`, type: 0, topic: 'Description' }
```
2. Add detection logic in `chPerms()`:
```javascript
const isNewChannel = n.includes('channel');
```
3. Add permission rules for new channel type
4. Add lookup mapping in console-builder.js:
```javascript
'channel name' -> 'DISCORD_NEW_CHANNEL_ID'
```
5. Update .env template in console-builder.js
6. Update documentation

### Adding a New Role

1. Add to `CONFIG.roles[]`:
```javascript
{ name: 'New Role', color: 0xHEXCOLOR, permissions: bit(P.PERM1, P.PERM2), hoist: true, mentionable: false, position: X }
```
2. Update all other role positions if needed
3. Add permission logic in `chPerms()` for new role index
4. Add to console-builder.js .env generation
5. Update documentation

---

## 29. Teardown and Reset

### Complete Teardown

To completely remove what the builder created:

1. Run the builder — it will delete everything and recreate
2. Or manually: kick the builder bot from the server
3. Then delete channels/categories/roles manually in Discord

### Partial Reset

To reset only channels (keep roles):
1. Manually delete all channels and categories
2. Leave roles intact
3. Run the builder — it will create new channels under fresh categories

### Role Reset

To reset only roles (keep channels):
1. Manually delete all custom roles
2. Run the builder — it will create new roles and reassign permissions

---

## 30. Backup and Restore

### What to Backup

| Item | How to Backup |
|------|---------------|
| Role IDs | Copy from .env file |
| Channel IDs | Copy from .env file |
| Server structure | This documentation |
| Bot token | Store securely offline |

### Restore Process

If the server is accidentally deleted or the structure is lost:

1. Create a new server (or use existing empty server)
2. Invite the builder bot with Administrator
3. Run console-builder.js
4. Enter the new Server ID
5. Wait for completion
6. Copy new .env values to main bot's Vercel environment
7. Verify main bot works with new IDs

### ID Migration

If you move to a new server:

1. Run builder on new server
2. Update .env with new IDs
3. Update main bot's Vercel env vars
4. Main bot will work with new server automatically

---

## 31. Testing Checklist

### Before First Use

- [ ] Discord application created
- [ ] Bot token generated
- [ ] Bot invited with Administrator permission
- [ ] Vercel project created
- [ ] Builder deployed to Vercel
- [ ] Console script updated with correct BUILDER_URL

### After Running Builder

- [ ] 5 roles created (Owner, Seller, Staff, Verified Customer, Member)
- [ ] Roles in correct order (Owner top, Member bottom)
- [ ] No dividers/bottom markers in categories with voice channels (Discord forces voice below text)
- [ ] 6 categories created
- [ ] 15 channels created
- [ ] Read-only channels: users can view, not send
- [ ] Normal channels: users can view and send
- [ ] Exclusive channels: only Verified Customer+ can view
- [ ] Hidden channels: only Staff+ can view
- [ ] Private channels: show spoiler overlay
- [ ] Voice channels: everyone can connect, only Staff+ can speak
- [ ] .env file generated with all IDs
- [ ] .env copied to clipboard

### Main Bot Integration

- [ ] .env values added to Vercel env vars
- [ ] Main bot responds to slash commands
- [ ] Catalog embed posts to product catalog channel
- [ ] Ticket panel posts to open your ticket channel
- [ ] Ticket creation works
- [ ] Order notifications post correctly
- [ ] XMR addresses display correctly

---

## 32. Performance Metrics

### Timing Breakdown

| Phase | Items | Time |
|-------|-------|------|
| Fetch existing | 2 API calls | ~200ms |
| Delete channels | 15 channels | ~1.5s |
| Delete categories | 6 categories | ~600ms |
| Delete roles | 4 roles | ~400ms |
| Wait for cache | - | 1.0s |
| Create roles | 5 roles | ~750ms |
| Reorder roles | 1 PATCH | ~200ms |
| Create categories | 6 categories | ~600ms |
| Create channels | 15 channels | ~1.5s |
| **Total** | **~50 operations** | **~6-8s** |

### API Calls

| Type | Count |
|------|-------|
| GET | 2 |
| DELETE | 20-25 |
| POST | 26 |
| PATCH | 1 |
| **Total** | **~50** |

### Memory Usage

- Node.js function: ~50-100 MB
- Vercel limit: 1024 MB
- Headroom: 90%+

---

## 33. Version History

### v1.0 (Initial)
- Basic server structure creation
- 5 roles, 6 categories, 15 channels
- Permission matrix for all channel types
- Console script for triggering

### v1.1 (Improved)
- Added rate limiting with retry-after support
- Added role reordering via PATCH
- Added box-drawing vertical bar (│) as pipe separator for channel names
- Improved error handling with .catch() on deletes

### v1.2 (Fixed)
- Fixed atob() issue (use Buffer.from())
- Fixed application ID parsing (hardcoded instead of decoded)
- Fixed orphaned empty categories (delete channels THEN categories)
- Fixed role ordering (POST then PATCH)
- Added visual styling: colored emojis + outline unicode alternating

### v1.3 (Documentation)
- Complete documentation with 34 sections
- Source code walkthrough
- Permission calculation algorithm
- Development guide
- Testing checklist
- Performance metrics

### v1.4 (Final Polish)
- Fixed CHANGE_NICKNAME permission bit (1 << 26, not 1 << 27)
- Fixed MANAGE_NICKNAMES permission bit (1 << 27, not 1 << 28)
- Added Character column to Unicode reference tables
- Fixed Server Structure tree to show actual emojis
- Fixed STAFF category emoji label (✴ eight pointed star)
- Updated version history to English

### v1.5 (Universal Framework)
- Reframed as universal Discord server builder, not Ambrosia-specific
- Added alternative server structures (gaming, hangout, dev/project)
- Made role names generic (Role 0-4 instead of Owner/Seller/Staff/etc.)
- Added role customization examples for different server types
- Updated permission matrix to use generic role indices
- Added customization checklist to Quick Reference Card
- Updated FAQ to be server-type agnostic
- Replaced custom spaces with pipe separator format (emoji│name)
- Added all 48 Discord permission flags to reference
- Added Channel Flags section with IS_SPOILER_CHANNEL support
- Added private: true support for channels in builder.js
- Added Section 17: Private Channels (Two Types) — spoiler channels vs permission-private channels with member overwrites

---

## 34. Glossary

| Term | Definition |
|------|------------|
| **Bitfield** | A number where each bit represents a permission |
| **Permission Overwrite** | Allow/deny rules for a specific role or member in a channel |
| **Hoisted** | Role appears separately in the member list |
| **Mentionable** | Role can be pinged with @rolename |
| **Managed** | Role controlled by a bot or integration (cannot be deleted) |
| **Eventual Consistency** | Discord's API may not reflect changes immediately |
| **Rate Limit** | Maximum number of API requests per time window |
| **Purge** | Deletion of all existing channels, categories, and roles |
| **Lookup Key** | Plain text channel/role name used to map to environment variables |
| **Serverless** | Function that runs on-demand, not 24/7 |
| **Cold Start** | First invocation of a serverless function (slower than warm) |
| **Parent ID** | The category a channel belongs to |
| **Position** | Numeric order of roles or channels (higher = higher in list) |
| **Box-Drawing Vertical Bar** | Unicode character U+2502 used as visual separator between emoji and name in channel names |
| **IS_SPOILER_CHANNEL** | Channel flag that hides channel behind spoiler overlay |
| **Private Channel** | Channel with spoiler overlay requiring click to reveal |

---

## 35. Quick Reference Card

### Your Bot Credentials
```
Application ID: <your app id>
Public Key: <your public key>
Secret: <your builder secret>
```

### Vercel
```
URL: <your vercel url>
Endpoint: POST /api/builder
Region: iad1 (US East)
```

### Discord Server
```
Guild ID: <your server id>
```

### Default Role Hierarchy (top to bottom)
```
Role 0 (Owner/Admin) - Administrator
Role 1 (Manager)     - Manage Channels, Manage Messages, Mention Everyone
Role 2 (Moderator)   - Kick Members, Manage Messages, Mention Everyone
Role 3 (Trusted)     - Change Nickname
Role 4 (Member)      - None
```

### Default Channel Types
```
Read-only:    rules, announcements, catalog, links
Normal:       general chat, off topic
Exclusive:    verified chat, verified voice (role 3+ only)
Hidden:       staff chat, notifications, logs (role 2+ only)
Voice:        general voice, support voice
Private:      channels with private: true (spoiler overlay)
```

### Permission Levels
```
Role 0: Administrator (bypass everything)
Role 1: Manage channels, messages, mentions + full chat
Role 2: Kick, manage messages, mentions + full chat
Role 3: Change nickname (or custom perm)
Role 4: None (inherits @everyone)
```

### Channel Flags
```
PINNED:                  1 << 1  = 2
REQUIRE_TAG:             1 << 4  = 16
HIDE_MEDIA_DOWNLOAD:     1 << 15 = 32768
CHANNEL_OBFUSCATED:      1 << 17 = 131072
IS_SPOILER_CHANNEL:      1 << 21 = 2097152
```

### Private Channel Types
```
Type 1: Spoiler Channel     - IS_SPOILER_CHANNEL flag (visual only)
Type 2: Permission-Private  - Member overwrites (type 1) + role overwrites (type 0)

Builder supports: role overwrites (auto) + member overwrites (manual or via config)
Discord "Make Private" button = deny @everyone + allow specific roles/members
```

### Spacing
```
Character: box-drawing vertical bar (U+2502) as separator
JS escape: \u2502
Format:    emoji\u2502name (regular spaces)
Example:   📌 \u2502 rules (not "📌 rules")
```

### Customization Checklist
- [ ] Edit CONFIG.roles in builder.js
- [ ] Edit CONFIG.categories in builder.js
- [ ] Add private: true to channels that need spoiler overlay
- [ ] Edit chPerms() for custom channel types
- [ ] Update console-builder.js .env generation
- [ ] Update documentation
