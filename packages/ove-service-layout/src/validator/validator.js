const validate = require("validate.js");

let requestValidators = {
    render: {
        "root": {presence: true},
        "root.type": {presence: true, isEqual: "container"},
        "root.sections": {
            presence: true,
            isNotEmpty: true,
            sectionValidator: {
                "#": {containerValidator: true},
                "#.type": {presence: true, isIn: ["container", "section"]},
            }
        }
    }
};

exports.validateRequest = (endpoint = "render", req) => {
    let constraints = requestValidators[endpoint];
    if (constraints) {
        let errors = validate(req.body, constraints);
        if (errors) {
            throw errors;
        }
    }
};

/**

 “root”: {
    “type”: “container”,
    “layout: “grid”,
     "sections": {
         "container1": {
              "type": "container",
              “layout-params”: { … }
               “layout”: “percent”,
               "sections": {
                     "section1": {
                            "type": "section",
                             “layout-params”: { … }
                            “app”: { … }
                       }}},

            "container2": { … }

 **/