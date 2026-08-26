# Ambrosia Architect - Discord Server Builder

A standalone serverless bot that builds your entire Ambrosia Discord server from scratch. Trigger it from the browser console and get every ID extracted automatically.

---

## What It Does

1. Nukes all existing channels and roles (except @everyone and managed roles)
2. Creates 6 roles: Member, Verified Customer, Staff, Seller, Owner, Architect Bot
3. Creates 5 categories and 15 channels with proper permissions
4. Posts embeds: product catalog, ticket panel, links, rules, announcements, XMR addresses
5. Returns every role ID, category ID, and channel ID
6. Generates a complete .env file for your main bot
7. Posts a summary embed to your log channel

---

## Setup

### Step 1: Create a New Discord Application

1. Go to https://discord.com/developers/applications
2. Click "New Application" and name it "Architect"
3. Go to "Bot" tab and click "Add Bot"
4. Enable these Privileged Gateway Intents:
   - MESSAGE CONTENT INTENT (required)
   - SERVER MEMBERS INTENT (optional but recommended)
5. Copy the Bot Token
6. Go to "OAuth2" > "URL Generator"
7. Select scopes: `bot`, `applications.commands`
8. Select permissions: Administrator (needed to create roles, channels, set permissions)
9. Copy the generated URL and invite the bot to your server

### Step 2: Encode the Bot Token

The bot token is base64-encoded in the source code. To encode yours:

In the browser console (F12):
```javascript
btoa('YOUR_BOT_TOKEN_HERE')
```

Replace `PASTE_YOUR_BASE64_ENCODED_BUILDER_BOT_TOKEN_HERE` in `api/builder.js` with the result.

### Step 3: Deploy to Vercel

1. Push the `builder-bot/` folder to a GitHub repository
2. Go to https://vercel.com and import the repository
3. Set the root directory to `.` (or `builder-bot` if it's a subfolder)
4. Deploy

Your builder endpoint will be:
```
https://YOUR-PROJECT.vercel.app/api/builder
```

### Step 4: Update the Console Script

Open `console-builder.js` and update these values:

```javascript
const BUILDER_URL = 'https://YOUR-VERCEL-PROJECT.vercel.app/api/builder';
const BOT_TOKEN = 'YOUR_BASE64_ENCODED_BUILDER_BOT_TOKEN';
const GUILD_ID = 'YOUR_DISCORD_SERVER_ID';
const LOG_CHANNEL_ID = 'YOUR_LOG_CHANNEL_ID';
```

### Step 5: Run It

1. Open your Vercel website in the browser (or any page)
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Paste the entire contents of `console-builder.js`
5. Press Enter
6. Wait 5-10 seconds
7. All IDs will be printed in the console
8. The .env file will be copied to your clipboard

---

## What Gets Created

### Roles (bottom to top)

| Role | Color | Permissions |
|------|-------|-------------|
| Member | Gray (#808080) | None (inherits @everyone) |
| Verified Customer | Green (#2ECC71) | None (inherits @everyone) |
| Staff | Blue (#3498DB) | None (inherits @everyone), mentionable |
| Seller | Orange (#E67E22) | None (inherits @everyone), mentionable |
| Owner | Red (#E74C3C) | Administrator |
| Architect Bot | Dark (#2C2F33) | Administrator |

### Categories and Channels

**INFORMATION**
- #rules (read-only)
- #announcements (read-only)
- #product-catalog (read-only)
- #links (read-only)

**GENERAL**
- #general-chat
- #off-topic

**SUPPORT**
- #open-your-own-ticket (with dropdown panel)
- #ticket-logs (staff only)

**STAFF**
- #staff-chat (hidden from members)
- #order-notifications (hidden from members)
- #xmr-addresses (hidden from members)

**VOICE**
- General Voice
- Support Voice

### Permission Matrix

| Channel | @everyone | Member | Verified Customer | Staff | Seller | Owner |
|---------|-----------|--------|-------------------|-------|--------|-------|
| rules | Read only | Read only | Read only | Full | Full | Admin |
| announcements | Read only | Read only | Read only | Full | Full | Admin |
| product-catalog | Read only | Read only | Read only | Full | Full | Admin |
| links | Read only | Read only | Read only | Full | Full | Admin |
| general-chat | Full | Full | Full | Full | Full | Admin |
| off-topic | Full | Full | Full | Full | Full | Admin |
| open-your-own-ticket | Full | Full | Full | Full | Full | Admin |
| ticket-logs | Hidden | Hidden | Hidden | Full | Full | Admin |
| staff-chat | Hidden | Hidden | Hidden | Full | Full | Admin |
| order-notifications | Hidden | Hidden | Hidden | Full | Full | Admin |
| xmr-addresses | Hidden | Hidden | Hidden | Full | Full | Admin |
| general-voice | Full | Full | Full | Full | Full | Admin |
| support-voice | Full | Full | Full | Full | Full | Admin |

"Full" = VIEW_CHANNEL + SEND_MESSAGES + EMBED_LINKS + ATTACH_FILES
"Read only" = VIEW_CHANNEL (SEND_MESSAGES denied)
"Hidden" = VIEW_CHANNEL denied
"Admin" = Administrator permission

---

## Console Output

After running, the console shows:

1. All role IDs (Member, Verified Customer, Staff, Seller, Owner, Architect Bot)
2. All category IDs (INFORMATION, GENERAL, SUPPORT, STAFF, VOICE)
3. All channel IDs (15 channels)
4. A complete .env file ready to paste
5. A summary embed is posted to your log channel

---

## Important Notes

- The builder bot needs Administrator permission to create roles and channels
- The builder bot is separate from the main Ambrosia ticket bot
- After building, you can remove the builder bot from the server
- The main bot uses the extracted IDs from the .env file
- The builder bot does NOT set up the main bot - it only builds the server structure
- Each run fully rebuilds the server (deletes everything first)
- The 10-second Vercel timeout is not an issue because all API calls are fast
