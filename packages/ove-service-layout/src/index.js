#!/usr/bin/env node

// custom validator extensions
require("./validator/extensions");

const HttpStatus = require("http-status-codes");

const logger = require("debug")("layout:app");

const express = require("express");
const app = express();

const {normalizePort, convertError} = require("./util");

const {renderRoute} = require("./routes/render");

const {registerAllLayouts} = require("./layout/manager");
registerAllLayouts();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post("/render", renderRoute);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    error = convertError(error);
    logger("error", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
});

const port = normalizePort(process.env.PORT || "3000");
app.listen(port, () => logger(`Listening on port ${port}!`));