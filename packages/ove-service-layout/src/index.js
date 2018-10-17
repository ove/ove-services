#!/usr/bin/env node

// custom validator extensions
require("./validator/extensions");

let logger = require("debug")("layout:app");

let express = require("express");
let app = express();

let {normalizePort, convertError} = require("./util");

let {renderRoute} = require("./routes/render");

let {registerAllLayouts} = require("./layout/manager");
registerAllLayouts();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post("/render", renderRoute);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    error = convertError(error);
    logger("error", error);
    res.status(500).json(error);
});

let port = normalizePort(process.env.PORT || "3000");
app.listen(port, () => logger(`Listening on port ${port}!`));