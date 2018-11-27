// custom validator extensions
require("./extensions");

const validate = require("validate.js");

let requestValidators = {
    render: {
        "oveSpace": {
            presence: true, objectValidator: {
                single: {url: {allowLocal: true}},
                object: {
                    "geometry": {presence: true, isNotEmpty: true},
                    "geometry.w": {presence: true, isNumber: true},
                    "geometry.h": {presence: true, isNumber: true}
                }
            }
        },
        "canvas": {presence: true},
        "canvas.layout": {presence: true, isNotEmpty: true},
        "canvas.layout.type": {presence: true, isNotEmpty: true, isString: true},
        "canvas.sections": {
            presence: true,
            isNotEmpty: true,
            sectionValidator: {
                "#": {containerValidator: true},
                "#.type": {presence: true, isIn: ["container", "section"]},
            }
        }
    },
    oveResponse: {
        "geometry": {presence: true, isNotEmpty: true},
        "geometry.x": {presence: true, isNumber: true},
        "geometry.y": {presence: true, isNumber: true},
        "geometry.w": {presence: true, isNumber: true},
        "geometry.h": {presence: true, isNumber: true}
    }
};

exports.validateRequest = (endpoint, req) => {
    let constraints = requestValidators[endpoint];
    if (constraints) {
        let errors = validate(req, constraints);
        if (errors) {
            throw errors;
        }
    }
};
