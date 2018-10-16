const validate = require("validate.js");

let requestValidators = {
    render: {
        "ove-space": {presence: true, isString: true},
        "canvas": {presence: true},
        "canvas.layout": {presence: true, isNotEmpty: true},
        "canvas.layout.type": {presence: true, isString: true},
        "canvas.sections": {
            presence: true,
            isNotEmpty: true,
            sectionValidator: {
                "#": {containerValidator: true},
                "#.type": {presence: true, isIn: ["container", "section"]},
            }
        }
    },
};

exports.validateRequest = (endpoint = "render", req) => {
    let constraints = requestValidators[endpoint];
    if (constraints) {
        let errors = validate(req, constraints);
        if (errors) {
            throw errors;
        }
    }
};