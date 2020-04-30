const op = require('./config.json');
const DBLWorker = require('./DBLWorker');

module.exports = DBLWorker;

new DBLWorker(op.port, op.path, op.options);