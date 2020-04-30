const op = require('./config.json');
const DBLWorker = require('./DBLWorker');

const DBLHook = new DBLWorker(op.port, op.path, op.options);