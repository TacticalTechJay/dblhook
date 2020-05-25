# DBLHook

Ditch KSoft.Si and use your own self hosted webhook!

Using this is nearly simple, all you need is node, npm, a database that works with TypeORM, and most importantly, a discord bot listed on [Discord Bot List](https://top.gg "Discord Bots | Discord Bot List").

## Prerequisites

Dependencies needed for running DBLHook

### Node

Node.JS is what runs the show, and you will need it before anything else. Install it [here](https://nodejs.org)

Verify your installation by running these commands

```sh
npm -v
node -v
```

They should all output something along the lines of

```sh
-> npm -v
node 6.14.4
-> node -v
v13.13.0
```

### Common Databases

- PostgreSQL
- CockroachDB
- MySQL
- MariaDB
- Microsoft SQL Server
- MongoDB (Coming soon!)

##### (Check out [this](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md) for all types, you will need to use a different ORM config later on, view [this](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md#common-connection-options) for every option, more on this on Database configuration setup step)

### An Open Port

You MUST have an open port (80) for this dbl webhook to be used else everything will end up becoming a catastrophic failure.

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

## Updating DBLHook

Updating DBLHook is very simple. You can simpley run the following command in the `DBLHook` directory and restarting the process.

```sh
git pull && npm i
```

## Installation

Now that you have considered what prerequisites you would like, lets actually install this!

### Get the Source & Install Dependencies

You can get the source with [git-scm](https://git-scm.com/)

```sh
git clone https://github.com/TacticalTechJay/dblhook.git
cd dblhook
npm i
```

### Configuration Options

Every single configuration option will be listed here

#### Host Configuration

**Config Property:** `host`

| Config Property | Type    | Description / Expected Values                          |
| --------------- | ------- | ------------------------------------------------------ |
| `host.port`     | integer | Port to host Webhook                                   |
| `host.path`     | string  | Path to wherever the webhook can be.                   |

#### Database Configuration

**Config Property:** `db`

| Config Property   | Type     | Description / Expected Values                    |
| ----------------- | -------- | --------------------------------------------------------------------------------- |
| `db.type`        | string   | `mariadb`, `mysql`, `postgres`, `cockroach`, `mssql`                              |
| `db.host`        | string   | `localhost` or public IP                        |
| `db.port`        | integer  | `5432` or different port                        |
| `db.username`    | string   | username for chosen database                    |
| `db.password`    | string   | password for database                           |
| `db.database`    | string   | database name                                   |

#### Webhook Configuration

**Config Property:** `webhook`

| Config Property | Type    | Description / Expected Values                          |
| --------------- | ------- | ------------------------------------------------------ |
| `webhook.use`     | boolean | Whether or not to use a webhook to discord.          |
| `webhook.url`     | string  | Discord's webhook url for an on vote.                |

#### Auth Configuration

**Config Property:** `authentication`

| Config Property | Type    | Description / Expected Values                          |
| --------------- | ------- | ------------------------------------------------------ |
| `authentication.bot`     | string | A bot token to use Discord's API for user fetching.                                   |
| `authentication.dbl`     | string  | A token for the DBL's use to authenticate with the webhook                   |

#### Sentry Config

| Config Property | Type    | Description / Expected Values                          |
| --------------- | ------- | ------------------------------------------------------ |
| `Sentry-DSN`    | string  | Used for sentry.io error collecting. Report any errors to me.              |


## Example Config

```json
// config.json
{
    "host": {
        "post": 6969,
        "path": "/hook"
    },
    "db": {
        "type": "mysql",
        "host": "localhost",
        "port": 1234,
        "username": "cookieDestroyer69",
        "password": "cookiesFTW",
        "database": "cookies"
    }, 
    "webhook": {
        "use": true,
        "url": "https://discordapp.com/api/webhooks/123456789123456789/TotallyLegit-Webhook"
    },
    "authentication": {
        "bot": "totally-legit-bot-token",
        "dbl": "totally-legit-auth-token"
    },
    "Sentry-DSN": "https://totallylegit@sentry.link"
}
```

### ***Before you run this, rename utils/user.example.js to utils/User.js***

### Running The Webhook

Get this webhook started by running the following command.

```js
node index.js
```
