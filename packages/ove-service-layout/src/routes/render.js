const HttpStatus = require("http-status-codes");

const {convertError} = require("../util");

const {validateRequest} = require("../validator/validator");
const {layoutManager} = require("../layout/manager");

const logger = require("debug")("layout:render");

const {oveClient} = require("../routes/ove");

exports.renderRoute = (req, res) => {
    validateRequest("render", req.body);

    logger("Request", req.body);

    oveClient.getConfiguration(req.body["oveSpace"]).then(config => {
        res.status(HttpStatus.OK).json(layoutManager.renderCanvas(req.body, config.geometry));
    }).catch(error => {
        error = convertError(error);
        logger("error", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    });
};
