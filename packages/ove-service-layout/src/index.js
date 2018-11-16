#!/usr/bin/env node

// custom validator extensions
require("./validator/extensions");

const HttpStatus = require("http-status-codes");
const cors = require("cors");

const logger = require("debug")("layout:app");

const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const {normalizePort, convertError} = require("./util");

const {renderRoute} = require("./routes/render");

const {registerAllLayouts} = require("./layout/manager");
registerAllLayouts();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/render", renderRoute);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    error = convertError(error);
    logger("error", JSON.stringify(error), "for request", JSON.stringify(req.body));
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
});

const port = normalizePort(process.env.PORT || "3000");
app.listen(port, () => logger(`Listening on port ${port}!`));
