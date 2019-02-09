const { Constants } = require('./server/constants/persistence');
const path = require('path');
const express = require('express');
const app = express();
const { Utils } = require('@ove-lib/utils')(Constants.APP_NAME, app);
const log = Utils.Logger(Constants.SERVICE_NAME);
const server = require('http').createServer(app);

log.debug('Using Express JSON middleware');
app.use(express.json());

Utils.buildAPIDocs(path.join(__dirname, 'swagger.yaml'), path.join(__dirname, '..', 'package.json'));

// APIs
require(path.join(__dirname, 'server', 'api'))(app, log, Utils);

const port = process.env.PORT || 8080;
server.listen(port);
log.info(Constants.SERVICE_NAME, 'service started, port:', port);
