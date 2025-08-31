const fs = require("fs");
const path = "./sentEmails.json";

let sentEmails = new Set();

// Load previously sent emails
if (fs.existsSync(path)) {
  const data = fs.readFileSync(path, "utf8");
  try {
    sentEmails = new Set(JSON.parse(data));
  } catch (e) {
    sentEmails = new Set();
  }
}

// Check if email is new
function isNewEmail(id) {
  return !sentEmails.has(id);
}

// Mark email as sent
function markEmailAsSent(id) {
  sentEmails.add(id);
  fs.writeFileSync(path, JSON.stringify([...sentEmails]));
}

module.exports = { isNewEmail, markEmailAsSent };
