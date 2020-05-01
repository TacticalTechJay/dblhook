const op = require('./config.json');
const DBLWorker = require('./DBLWorker');

new DBLWorker(op.host, op.db, op.webhook, op.authentication);