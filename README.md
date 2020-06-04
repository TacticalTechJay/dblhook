# DBLHook

Ditch KSoft.Si and use your own self hosted vote tracker!

## Installation
```sh
npm i dblhook
```

You must install a database driver and have a database running to use this. The choices are below.

#### Getting PostgreSQL Drivers

Run the following command in order to get PostgreSQL drivers

```sh
npm i pg --save
```

#### Getting CockroachDB Drivers

Run the following command in order to get CockroachDB drivers

```sh
npm i cockroachdb --save
```

#### Getting MySQL Drivers

Run the following command in order to get MySQL drivers

```sh
npm i mysql --save
```

#### Getting MariaDB Drivers

Run the following command in order to get MariaDB drivers

```sh
npm i mariadb --save
```

#### Getting Microsoft SQL Drivers

Run the following command in order to get Microsoft SQL drivers

```sh
npm i mssql --save
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
    },
    webhook: {
        use: true,
        url: "https://discordapp.com/api/webhooks/123456789123456789/TotallyLegit-Webhook"
    }
});
```
You can then let it run its course although I suggest that you use this as its own process.

**__NOTE: YOU MUST HAVE PORT 80 OR CUSTOM PORT OPEN. IF THE PORT IS NOT AVAILABLE, EVERYTHING WILL END UP AS A CATASTROPHIC FAILURE LIKE YOU.__**