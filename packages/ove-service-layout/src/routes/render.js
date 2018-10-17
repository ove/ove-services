let {convertError} = require("../util");

let {validateRequest} = require("../validator/validator");
let {layoutManager} = require("../layout/manager");

let logger = require("debug")("layout:render");

let {oveClient} = require("../routes/ove");

exports.renderRoute = (req, res) => {
    validateRequest("render", req.body);

    logger("Request", req.body);

    oveClient.getConfiguration(req.body["ove-space"]).then(config => {
        res.status(200).json(layoutManager.renderCanvas(req.body, config.geometry));
    }).catch(error => {
        error = convertError(error);
        logger("error", error);
        res.status(500).json(error);
    });
};
