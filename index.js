// Declaring variables and destructuring to get important values
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
} = require("dotenv").config().parsed;

// Declaring instances for express, telegram_bot and oauth2
const app = express();
const bot = new TelegramBot(telegramBotToken, { polling: true });
const oauth2Client = new OAuth2Client({
  clientId: oa_clientId,
  clientSecret: oa_clientSecret,
  redirectUri: oa_redirectUri,
});

// Create a URL for user consent
const consentUrl = oauth2Client.generateAuthUrl({
  access_type: oa_accessType,
  scope: ["https://www.googleapis.com/auth/gmail.readonly"],
});

// Redirect the user to the Google OAuth consent page
app.get("/auth", (req, res) => {
  res.redirect(consentUrl);
});

// Handle the callback with the authorization code
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.send(
      "Authentication successful. You can now monitor your Gmail account."
    );
    console.log("Authentication Successful");
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(500)
      .send("Authentication error. Check the console for details.");
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Set up the Gmail API
const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

// Function to check for new emails
async function checkForNewEmails() {
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread", // Modify the query as needed
    });

    const messages = response.data.messages;

    if (messages && messages.length > 0) {
      // Perform your desired actions for new emails
      for (const message of messages) {
        const messageId = message.id;
        const email = await gmail.users.messages.get({
          userId: "me",
          id: messageId,
          format: "full", // Get the full email content
        });

        // Send a message
        bot
          .sendMessage(
            myChatId,
            `New Mail \nSubject | ${
              email.data.subject || "No Subject"
            }\nBody | ${getEmailBody(email.data)}`
          )
          .then(() => {
            console.log("Message sent successfully.");
          })
          .catch((error) => {
            console.error("Error sending message:", error);
          });
      }
    } else {
      /* bot.sendMessage(myChatId, `No new mails`)
                 .then(() => {
                     console.log('Message sent successfully.');
                 })
                 .catch((error) => {
                     console.error('Error sending message:', error);
                 });
            */
      console.log("No new emails.");
    }
  } catch (error) {
    console.error("Error checking for new emails:", error);
  }
}

setInterval(checkForNewEmails, refreshtime * 60 * 1000); // 5 minutes
