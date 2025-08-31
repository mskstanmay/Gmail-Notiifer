# Gmail Notifier


Hi! Just a student from VIT University, too lazy to check emails manually… so I made this. 😅


## Configurations ⚙️


Set the following in your .env file or configuration:


```env
PORT=3000
REFRESH_TIME=1 # in minutes
MY_CHAT_ID= # Your Telegram chat ID
TELEGRAM_BOT_TOKEN= # Telegram Bot token
OA_CLIENT_ID= # OAuth2 Client ID from API portal
OA_CLIENT_SECRET= # OAuth2 Client Secret from API portal
OA_REDIRECT_URI=http://localhost:PORT/callback
OA_ACCESS_TYPE=offline
```


> Make sure to replace PORT and credentials with your actual values.


## Procedure


1. Start the project:


```bash
node index.js
```


2. Open the authentication URL in your browser:


```
http://localhost:PORT/auth
```


3. Authenticate with your college email account.


4. Sit back and relax — the bot will send notifications to your Telegram based on the refresh interval defined in REFRESH_TIME.
`
