const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const DBLWorkerWebhookClient = require('./DBLWorkerWebhookClient.js');
const { createConnection, EntitySchema } = require('typeorm');
const EventEmitter = require('events');

module.exports = class DBLWorker extends EventEmitter {
    constructor(port = 8080, path = "/", op = {
        db: {
            type: null,
            host: null,
            username: null,
            password: null,
            database: null,
        },
        webhook: {
            use: false,
            url: null
        },
        authentication: {
            bot: null,
            dbl: null
        }
    }) {
        super();
        for (const k of Object.keys(op.db)) if (!op.db[k]) throw new Error(`DBLWorkerError: options.db.${k} is undefined`);
        for (const k of Object.keys(op.authentication)) if (!op.authentication[k]) throw new Error(`DBLWorkerError: options.authentication.${k} is undefined`);
        if (op.webhook.use && !op.webhook.url) throw new Error(`DBLWorkerError: options.webhook.url is undefined`);

        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.port = Number(port);
        this.path = path;
        this.op = op;
        this.init();
        this.routes();
    }
    routes() {
        this.app.post(this.path, async (req, res) => {
            if (req.get('Authorization') !== this.op.authentication.dbl) return res.sendStatus(403);
            setTimetout(async () => {
                const user = await require('./util/getUser.js')(client, req.body.user);
                user.voted = false;
                await client.orm.repos.user.save(user);
            }, 43200000)
            const user = await require('./util/getUser.js')(client, req.body.user);
            user.voted = true;
            await client.orm.repos.user.save(user);
            if (this.op.authentication.bot && this.op.webhook.use) var us = await (await fetch(`https://discordapp.com/api/v6/users/${user}`), {
                headers: { 'Authorization': `Bot ${this.op.authentication.bot}`}
            }).json()
            if (this.op.webhook.use) return new DBLWorkerWebhookClient(this.op.webhook.url).send({
                    content: "b",
                    username: "b"
                });
        });

        this.app.get(`*`, (req, res) => {
            res.status(404).send('You are not supposed to be here!');
        });

        this.app.listen(this.port, () => {
            console.log(`Listening on port ${this.port}! Your webhook will be on ${this.path}. Your auth token is ${this.op.authentication.dbl}`);
        })
    }
    async init() {
        const connection = await createConnection({
            ...this.op.db,
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