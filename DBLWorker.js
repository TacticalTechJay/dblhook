const http = require('http');
const fetch = require('petitio');
const DBLWorkerWebhookClient = require('./DBLWorkerWebhookClient.js');
const { createConnection, EntitySchema } = require('typeorm');

module.exports = class DBLWorker {
    constructor({host = { port: 8080, path: '/' }, database = { type: null, host: null, username: null, password: null, database: null }, webhook = { use: false, url: null }, authentication = { bot: null, dbl: null }}) {
        for (const k of Object.keys(database)) if (!database[k]) throw new Error(`DBLWorkerError: options.database.${k} is undefined`);
        for (const k of Object.keys(authentication)) if (!authentication[k]) throw new Error(`DBLWorkerError: options.authentication.${k} is undefined`);
        for (const k of Object.keys(host)) if (!host[k]) throw new Error(`DBLWorkerError: options.host.${k} is undefined`);
        for (const k of Object.keys(webhook)) if (!webhook[k]) throw new Error(`DBLWorkerError: options.webhook.${k} is undefined`);
        if (webhook.use && !webhook.url) throw new Error(`DBLWorkerError: options.webhook.url is undefined`);
        if (isNaN(host.port)) throw new Error('DBLWorkerError: options.host.port is not a number');
        this.app = http.createServer()
        this.host = host;
        this.db = database;
        this.webhook = webhook;
        this.authentication = authentication;
        this.init();
        this.routes();
    }
    routes() {
        this.app.on('request', async (req, res) => {
            req.setEncoding('utf8');
            let body = ''
            if (req.url !== this.host.path || req.method !== 'POST') return res.writeHead(404).end('You must be lost.')
            if (req.headers.Authorization !== this.authentication.dbl) return res.writeHead(403).end();
            req.on('data', (chunk) => body += chunk)
            req.on('end', () => {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    res.writeHead(400);
                    res.end(`DBLWorkerError: ${err.message}`)
                    throw new Error(`DBLWorkerError: ${err.message}`);
                }
            });
            setTimeout(async () => {
                if (body.type == 'test') return;
                const user = await require('./util/getUser.js')(this, body.user);
                user.premium.voter = false;
                await this.orm.repos.user.save(user);
            }, 43200000)
            if (body.type == 'test') {
                if (this.authentication.bot && this.webhook.use) var us = (await fetch(`https://discordapp.com/api/v6/users/${req.body.user}`).header('Authorization', `Bot ${this.authentication.bot}`).send()).json();
                if (this.webhook.use) return new DBLWorkerWebhookClient(this.webhook.url).send({
                    content: `${us ? `${us.username}#${us.discriminator} (${us.id})` : req.body.user} has voted! Yay! :D`,
                    username: "Top.gg Upvotes (Test)"
                });
            }
            const user = await require('./util/getUser.js')(this, req.body.user);
            user.premium.voter = true;
            await this.orm.repos.user.save(user);
            if (this.authentication.bot && this.webhook.use) var us = (await fetch(`https://discordapp.com/api/v6/users/${req.body.user}`).header('Authorization', `Bot ${this.authentication.bot}`).send()).json();
            if (this.webhook.use) return new DBLWorkerWebhookClient(this.webhook.url).send({
                content: `${us ? `${us.username}#${us.discriminator} (${us.id})` : req.body.user} has voted! Yay! :D`,
                username: "Top.gg Upvotes"
            });
            res.writeHead(200);
            res.end('ok');
        });

        this.app.listen(this.host.port || 8080, () => {
            console.log(`Listening on port ${this.host.port || '/'}! Your webhook will be on ${this.host.path || '/'}. Your auth token is ${this.authentication.dbl}`);
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