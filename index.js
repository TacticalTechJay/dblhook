const Sentry = require('@sentry/node');
const op = require('./config.json');
const DBLWorker = require('./DBLWorker');

if (op['Sentry-DSN']) Sentry.init({ dsn: op['Sentry-DSN'] });
new DBLWorker(op);