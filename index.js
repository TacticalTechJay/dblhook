const op = require('./config.json');
const DBLWorker = require('./DBLWorker');
new DBLWorker(op.port, op.path, op.options);