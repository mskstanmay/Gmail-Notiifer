# Gmail Notifier 📬

A simple tool for students (like me at VIT University) who want their Gmail notifications sent directly to Telegram.

---

## What is this?

Gmail Notifier is a Node.js app that monitors your Gmail inbox and sends notifications for new emails to your Telegram account using a bot. It uses Google OAuth2 for secure authentication and Telegram Bot API for messaging.

---

## Features

- **Instant Gmail notifications** on Telegram.
- **Secure OAuth2 authentication** with your Gmail account.
- **Customizable refresh interval** for checking new emails.
- **Webhook support** for Telegram bots (recommended for deployment).
- **Simple setup** with environment variables.

---

## Requirements

- Node.js (v16+ recommended)
- A Telegram account
- A Telegram bot token
- Your Telegram chat ID
- Google OAuth2 credentials (Client ID & Secret)
- [Render](https://render.com/) or similar hosting (optional, for webhook mode)

---

## Configuration ⚙️

Create a `.env` file in the project root with the following content:

```
port=3000                      # Port for Express server (OAuth callback)
Telegramport=3001              # Port for Telegram webhook (can be same or different)
refreshtime=1                  # Refresh time in minutes
myChatId=YOUR_TELEGRAM_CHAT_ID # Your Telegram chat ID
telegramBotToken=YOUR_TELEGRAM_BOT_TOKEN
oa_clientId=YOUR_GOOGLE_OAUTH_CLIENT_ID
oa_clientSecret=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
oa_redirectUri=http://localhost:3000/callback
oa_accessType=offline
```

**Note:**

- `port` is used for the Express server (OAuth callback and routes).
- `Telegramport` is used for the Telegram bot webhook.
- You can use the same port for both if running locally, but separate ports are recommended for deployment.

---

## Step-by-Step Setup Guide 🚀

### 1. Get Your Telegram Chat ID

1. Open Telegram and search for [@userinfobot](https://t.me/userinfobot).
2. Start a chat and send `/start`.
3. The bot will reply with your `chat ID`. Copy it for later.

### 2. Create a Telegram Bot & Get Token

1. Search for [@BotFather](https://t.me/BotFather) in Telegram.
2. Send `/newbot` and follow the instructions to create your bot.
3. BotFather will give you a token (looks like `123456789:ABCdefGhIJKlmNoPQRstuVwXyZ`).  
   Copy this token for your `.env` file.
4. Start a chat with your new bot and send any message (required for notifications).

### 3. Get Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Go to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Choose **Web application**.
6. Set **Authorized redirect URI** to `http://localhost:3000/callback` (or your deployed URL).
7. Copy your **Client ID** and **Client Secret** for the `.env` file.
8. Enable the **Gmail API** for your project:
   - Go to **APIs & Services > Library**.
   - Search for "Gmail API" and enable it.

---

## Usage

1. **Install dependencies:**

   ```
   npm install
   ```

2. **Start the server:**

   ```
   node index.js
   ```

3. **Authenticate with Gmail:**

   - Open [http://localhost:3000/](http://localhost:3000/) in your browser.
   - You will be redirected to Google OAuth. Sign in with your Gmail account and grant permissions.

4. **Receive notifications:**
   - New unread emails will be sent to your Telegram chat as notifications.

---

## How it Works

- The app uses Google OAuth2 to access your Gmail inbox.
- It periodically checks for new unread emails (interval set by `refreshtime`).
- If a new email is found, it sends a formatted message to your Telegram chat using your bot.
- Sent email IDs are stored in `sentEmails.json` to avoid duplicate notifications.

---

## File Structure

- `index.js` — Main server and logic.
- `functions.js` — Helper functions for parsing emails and sending Telegram messages.
- `emailStorage.js` — Tracks sent email IDs to prevent duplicates.
- `sentEmails.json` — Stores IDs of already notified emails.
- `.env` — Your configuration (not committed to git).
- `README.md` — This documentation.

---

## Troubleshooting

- **No notifications?**
  - Make sure your `.env` is filled correctly.
  - Ensure you have started a chat with your bot.
  - Check console logs for errors.
- **OAuth issues?**
  - Double-check your redirect URI in Google Cloud Console.
  - Make sure Gmail API is enabled.
- **Webhook issues?**
  - If deploying, set `WEBHOOK_URL` in `index.js` to your public server URL.

---

## Security Notes

- Never share your bot token, client secret, or `.env` file publicly.
- For production, use HTTPS and secure your server endpoints.

---

## License

ISC © Msks Tanmay

---

## Credits

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
