const fetch = require('node-fetch');

module.exports = class DBLWorkerWebhookClient {
    constructor(url = null, token = null) {
        if (!url) throw new Error('No URL or id supplied');
        const parse = this.constructor.parseWebhook(url);
        this.id = url && token ? url : parse.id;
        this.token = url && token ? token : parse.token;
    }
    async send(content = null) {
        if (!content) throw new Error('DBLWorkingWebhookClientError: No content was provided.');
        const res = await fetch(`https://discordapp.com/api/webhooks/${this.id}/${this.token}`, {
            type: 'POST',
            body: JSON.stringify(content)
        });
        return await res.json();
    }
    static parseWebhook(text) {
        const m = text.match(/^https:\/\/(?:(?:canary|ptb).)?discordapp.com\/api\/webhooks\/(\d+)\/([\w-]+)\/?$/);
        if (!m) return null;
        return { id: m[1], token: m[2] };
    }
}