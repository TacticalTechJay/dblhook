# DBLHook

Ditch KSoft.Si and use your own self hosted vote tracker!

## Installation
```
npm i dblhook
```

## Example Usage

```js
const Hooker = require('dblhook');
new Hooker({
    database: {
        type: "postgres",
        host: "12.3.4.56",
        user: "Human",
        password: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789",
        database: "Human-Bot"
    },
    authentication: {
        bot: "totallyLegitDiscordBotToken",
        dbl: "verrySecureDBLWebhookAuth"
    }
});
```
You can then let it run its course although I suggest that you use this as its own process.

**__NOTE: YOU MUST HAVE PORT 80 OR THE CUSTOM PORT OPEN. IF THE PORT IS NOT, EVERYTHING WILL END UP AS A CATASTROPHIC FAILURE.__**