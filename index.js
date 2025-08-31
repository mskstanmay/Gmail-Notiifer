// index.js

require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { getEmailBody } = require("./functions");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

const {
  port,
  myChatId,
  telegramBotToken,
  oa_clientId,
  oa_clientSecret,
  oa_redirectUri,
  oa_accessType,
  refreshtime,
} = process.env;

// ------------------------
// Initialize services
// ------------------------
const app = express();
const bot = new TelegramBot(telegramBotToken);
const WEBHOOK_URL = "https://vitapmails.onrender.com/bot"; // replace with your Render URL

// Tell Telegram where to send updates
bot.setWebHook(`${WEBHOOK_URL}?token=${telegramBotToken}`);

const oauth2Client = new OAuth2Client(
  oa_clientId,
  oa_clientSecret,
  oa_redirectUri
);

// ------------------------
// OAuth consent URL
// ------------------------
const consentUrl = oauth2Client.generateAuthUrl({
  access_type: oa_accessType,
  scope: ["https://www.googleapis.com/auth/gmail.readonly"],
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

app.get("/", (req, res) => {
  res.redirect(consentUrl);
});

app.post("/bot", (req, res) => {
  bot.processUpdate(req.body); // process Telegram update
  res.sendStatus(200);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Authorization code missing");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

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
  console.log(`App listening at http://localhost:${port}`);
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
        const fullMsg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });

        const subject =
          fullMsg.data.payload?.headers?.find((h) => h.name === "Subject")
            ?.value || "No Subject";

        const from =
          email.data.payload.headers.find((h) => h.name === "From")?.value ||
          "Unknown Sender";
        const snippet = email.data.snippet || "";

        const message = `
📬 *New Email Received!*

*From:* ${from}
*Subject:* ${subject}

📝 _Snippet:_
${snippet}

🔗 [Open in Gmail](https://mail.google.com/mail/u/0/#inbox)
`;
        bot
          .sendMessage(myChatId, message, { parse_mode: "Markdown" })
          .then(() => console.log("Styled message sent successfully."))
          .catch((err) => console.error("Error sending styled message:", err));
        bot
          .sendMessage(
            myChatId,
            `📧 New Mail\nSubject: ${subject}\n\nBody:\n${getEmailBody(
              fullMsg.data
            )}`
          )
          .then(() => console.log("Telegram message sent."))
          .catch((err) =>
            console.error("Error sending Telegram message:", err)
          );
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
