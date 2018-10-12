#!/usr/bin/env node

// custom validator extensions
require('./validator/extensions');

let logger = require('debug')('layout:app');

let express = require('express');
let app = express();

let {normalizePort} = require('./util');

let {renderRoute} = require('./routes/render');

let {registerAllLayouts} = require('./layout/manager');
registerAllLayouts();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/render', renderRoute);

let port = normalizePort(process.env.PORT || '3000');
app.listen(port, () => logger(`Listening on port ${port}!`));