# Gmail_Notifier

Hi, Just of student of Vit University too lazy to check his email...

### Configrations ⚙️
- port=3000 
- refreshtime=1 (In minutes)
- myChatId= [ Your telegram chat id in here ]
- telegramBotToken=[ Telegram Bot token ]
- oa_clientId= [ Oauth2 clientId from api portal ]
- oa_clientSecret= [ Oauth2 clientSecret from api portal ]
- oa_redirectUri= http://localhost:port/callback
- oa_accessType=offline 

## Proccedure
- Start the project using `node index.js`
- Go to the http://localhost:port/auth to autheticate with the college mail id
- Now just wait for the time mentioned in the dotenv to recieve a message on telegram
