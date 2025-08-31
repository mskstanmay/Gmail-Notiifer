# Gmail Notifier 📬

A simple tool for lazy students (like me at VIT University) who want their Gmail notifications sent directly to Telegram.

---

## Features

- Notifies you of new Gmail messages via Telegram.
- Easy OAuth2 authentication with your college email.
- Customizable refresh interval.

---

## Configuration ⚙️

Create a `.env` file in the project root with the following:

```
port=3000
refreshtime=1                # Refresh time in minutes
myChatId=YOUR_TELEGRAM_CHAT_ID
telegramBotToken=YOUR_TELEGRAM_BOT_TOKEN
oa_clientId=YOUR_GOOGLE_OAUTH_CLIENT_ID
oa_clientSecret=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
oa_redirectUri=http://localhost:3000/callback
oa_accessType=offline
```

---

## Setup Guide 🚀

### 1. Get Your Telegram Chat ID

1. Start a chat with [@userinfobot](https://t.me/userinfobot) on Telegram.
2. Send `/start` and note your `chat ID` from the response.

### 2. Create a Telegram Bot & Get Token

1. Search for [@BotFather](https://t.me/BotFather) on Telegram.
2. Send `/newbot` and follow instructions to create your bot.
3. Copy the token provided (looks like `123456789:ABCdefGhIJKlmNoPQRstuVwXyZ`).

### 3. Get Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Choose **Web application**.
6. Set **Authorized redirect URI** to `http://localhost:3000/callback`.
7. Copy your **Client ID** and **Client Secret**.

---

## Usage

1. Install dependencies:

   ```
   npm install
   ```

2. Start the server:

   ```
   node index.js
   ```

3. Open [http://localhost:3000/auth](http://localhost:3000/auth) in your browser and authenticate with your college Gmail.

4. Wait for notifications on Telegram as new emails arrive!

---

## Troubleshooting

- Make sure all credentials are correct in `.env`.
- Ensure your bot is started and you’ve sent a message to it.
- Check console logs for errors.

---

## License

ISC ©
