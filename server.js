const app = require('./app');

const server = require('https').createServer(app);

module.exports = server;