let {validateRequest} = require('../validator/validator');
let {layoutManager} = require('./manager');

let logger = require('debug')('layout:render');

const renderRoute = (req, res) => {
    validateRequest("render", req);

    logger("Request", req.body);

    res.status(200).json({
        ...req.body,
        root: layoutManager.renderRoot(req.body.root, {x: 0, y: 0, w: 1920, h: 1080})
    });
};

exports.renderRoute = renderRoute;
