function getEmailBody(email) {
  const parts = email.payload.parts;
  if (parts) {
    for (const part of parts) {
      //console.log(part)
      if (part.mimeType === "text/plain") {
        return Buffer.from(part.body.data, "base64").toString();
      }
    }
  }
  return "No email body found.";
}

function parseEmailHeaders(emailData) {
  const headers = emailData.payload?.headers || [];
  const subject =
    headers.find((h) => h.name === "Subject")?.value || "No Subject";
  const from =
    headers.find((h) => h.name === "From")?.value || "Unknown Sender";
  return { subject, from };
}

function getSnippet(emailData) {
  return emailData.snippet || "";
}

async function sendTelegramMessage(bot, chatId, text) {
  try {
    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    console.log("Message sent successfully.");
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

module.exports = {
  getEmailBody,
  getSnippet,
  parseEmailHeaders,
  sendTelegramMessage,
};
