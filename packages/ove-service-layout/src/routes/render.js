const HttpStatus = require("http-status-codes");

const {convertError} = require("../util");

const {validateRequest} = require("../validator/validator");
const {layoutManager} = require("../layout/manager");

const { Utils } = require("@ove-lib/utils")();
const log = Utils.Logger("layout:render");

const {oveClient} = require("../routes/ove");

exports.renderRoute = (req, res) => {
    validateRequest("render", req.body);

    log.info("Request", req.body);

    oveClient.getConfiguration(req.body["oveSpaceGeometry"]).then(geometry => {
        res.status(HttpStatus.OK).json(layoutManager.renderCanvas(req.body, geometry));
    }).catch(error => {
        error = convertError(error);
        log.error(JSON.stringify(error), "for request", JSON.stringify(req.body));
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    });
};
