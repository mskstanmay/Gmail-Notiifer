// index.js

require("dotenv").config();
const express = require("express");
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const {
  getEmailBody,
  getSnippet,
  parseEmailHeaders,
  sendTelegramMessage,
} = require("./functions");
const { isNewEmail, markEmailAsSent } = require("./emailStorage");
const {
  port,
  myChatId,
  telegramBotToken,
  oa_clientId,
  oa_clientSecret,
  oa_redirectUri,
  oa_accessType,
  refreshtime,
  Telegramport,
} = process.env;
const TOKEN_PATH = "tokens.json";

// ------------------------
// Initialize services
// ------------------------
const app = express();
const bot = new TelegramBot(telegramBotToken, {
  polling: false,
  webHook: { port: Number(Telegramport) },
}); // disable polling for webhook mode
const WEBHOOK_URL = "https://vitapmails.onrender.com/bot"; // replace with your Render URL

// Tell Telegram where to send updates
bot.setWebHook(`${WEBHOOK_URL}?token=${telegramBotToken}`);

const oauth2Client = new OAuth2Client(
  oa_clientId,
  oa_clientSecret,
  oa_redirectUri
);

// ------------------------
// Load tokens if saved
// ------------------------
let tokens;
if (fs.existsSync(TOKEN_PATH)) {
  try {
    const data = fs.readFileSync(TOKEN_PATH, "utf8");
    if (data) {
      tokens = JSON.parse(data);
      oauth2Client.setCredentials(tokens);
      console.log("Loaded saved tokens ✅");
    } else {
      console.log("tokens.json is empty. Run auth flow again.");
    }
  } catch (err) {
    console.error(
      "Failed to parse tokens.json. Delete the file and re-authenticate.",
      err
    );
  }
}

// ------------------------
// OAuth consent URL
// ------------------------
const consentUrl = oauth2Client.generateAuthUrl({
  access_type: oa_accessType,
  scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  prompt: "consent",
});

// ------------------------
// Telegram bot events
// ------------------------
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hi! You'll receive Gmail updates here.");
});

// ------------------------
// Express routes
// ------------------------

app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});
app.get("/", (req, res) => {
  res.redirect(consentUrl);
});

app.post("/bot", (req, res) => {
  if (req.query.token !== telegramBotToken) return res.sendStatus(401);
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Authorization code missing");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log("Tokens saved ✅");

    res.send(
      "Authentication successful. Your Gmail account is now being monitored."
    );
    console.log("Authentication Successful");
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send("Authentication error. Check server logs.");
  }
});

app.listen(port, () => {
  console.log(`App listening at ${oa_redirectUri.slice(0, -9)}`);
});

// ------------------------
// Gmail API setup
// ------------------------
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

// ------------------------
// Function: Check for new emails
// ------------------------
async function checkForNewEmails() {
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
    });

    const messages = response.data.messages;

    if (messages && messages.length > 0) {
      for (const message of messages) {
        if (!isNewEmail(message.id)) continue;

        const fullMsg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });

        const { subject, from } = parseEmailHeaders(fullMsg.data);
        const snippet = getSnippet(fullMsg.data);
        const text = `
📬 *New Email Received!*

*From:* ${from}
*Subject:* ${subject}

📝 _Snippet:_
${snippet}

🔗 [Open in Gmail](https://mail.google.com/mail/u/0/#inbox)
`;

        await sendTelegramMessage(bot, myChatId, text);
        markEmailAsSent(message.id);
      }
    } else {
      console.log("No new emails.");
    }
  } catch (error) {
    console.error("Error checking for new emails:", error);
  }
}

// ------------------------
// Run the check periodically
// ------------------------
setInterval(checkForNewEmails, Number(refreshtime) * 60 * 1000);
