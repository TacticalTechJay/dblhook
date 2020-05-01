const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const DBLWorkerWebhookClient = require('./DBLWorkerWebhookClient.js');
const { createConnection, EntitySchema } = require('typeorm');

module.exports = class DBLWorker {
    constructor(host = { port: 8080, path: '/' }, db = { type: null, host: null, username: null, password: null, database: null }, webhook = { use: false, url: null }, authentication = { bot: null, dbl: null }) {
        for (const k of Object.keys(db)) if (!db[k]) throw new Error(`DBLWorkerError: options.db.${k} is undefined`);
        for (const k of Object.keys(authentication)) if (!authentication[k]) throw new Error(`DBLWorkerError: options.authentication.${k} is undefined`);
        if (webhook.use && !webhook.url) throw new Error(`DBLWorkerError: options.webhook.url is undefined`);

        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.host = host;
        this.db = db;
        this.webhook = webhook;
        this.authentication = authentication;
        this.init();
        this.routes();
    }
    routes() {
        this.app.post(this.host.path, async (req, res) => {
            if (req.get('Authorization') !== this.authentication.dbl) return res.sendStatus(403);
            setTimeout(async () => {
                if (req.body.type == 'test') return;
                const user = await require('./util/getUser.js')(this, req.body.user);
                user.premium.voter = false;
                await this.orm.repos.user.save(user);
            }, 43200000)
            if (req.body.type == 'test') {
                if (this.authentication.bot && this.webhook.use) var us = await (await fetch(`https://discordapp.com/api/v6/users/${req.body.user}`, {
                    headers: { 'Authorization': `Bot ${this.authentication.bot}`}
                })).json();
                if (this.webhook.use) return new DBLWorkerWebhookClient(this.webhook.url).send({
                    content: `${us ? `${us.username}#${us.discriminator} (${us.id})` : req.body.user} has voted! Yay! :D`,
                    username: "Top.gg Upvotes (Test)"
                });
            }
            const user = await require('./util/getUser.js')(this, req.body.user);
            user.premium.voter = true;
            await this.orm.repos.user.save(user);
            if (this.authentication.bot && this.webhook.use) var us = await (await fetch(`https://discordapp.com/api/v6/users/${req.body.user}`, {
                headers: { 'Authorization': `Bot ${this.authentication.bot}`}
            })).json();
            if (this.webhook.use) return new DBLWorkerWebhookClient(this.webhook.url).send({
                content: `${us ? `${us.username}#${us.discriminator} (${us.id})` : req.body.user} has voted! Yay! :D`,
                username: "Top.gg Upvotes"
            });
        });

        this.app.use(function (req, res, next) {
            res.status(404).send("Sorry can't find that!")
        })

        this.app.listen(this.host.port, () => {
            console.log(`Listening on port ${this.host.port}! Your webhook will be on ${this.host.path}. Your auth token is ${this.authentication.dbl}`);
        })
    }
    async init() {
        const connection = await createConnection({
            ...this.db,
            synchronize: true,
            entities: [
                new EntitySchema(require('./util/User.js'))
            ]
        });
        this.orm = {
            connection,
            repos: {
                user: connection.getRepository('User')
            }
        };
        if (!this.orm.connection.isConnected) throw new Error('Could not connection to orm.');
    }
}