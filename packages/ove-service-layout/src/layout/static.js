const validate = require("validate.js");
const {translateValidator} = require("../validator/extensions");

const {Layout, copyAndShiftCoordinates, copyCoordinates} = require("./layouts");

class StaticLayout extends Layout {
    name() {
        return "static"
    }

    render(sectionId, section, parent) {
        copyAndShiftCoordinates(parent, section, "x");
        copyAndShiftCoordinates(parent, section, "y");
        copyCoordinates(section, "w");
        copyCoordinates(section, "h");

        //todo; do some post validation
    }

    validate(sectionId, section) {
        for (let validator of this.validators()) {
            let errors = validate({[sectionId]: section}, translateValidator(validator, [sectionId]));
            if (errors) {
                throw errors
            }
        }
    }

    validators() {
        return [
            {
                "#": {
                    oneOf: [
                        {"x": {presence: true, isNumber: true}},
                        {"layout-params.x": {presence: true, isNumber: true}}
                    ]
                }
            },
            {
                "#": {
                    oneOf: [
                        {"y": {presence: true, isNumber: true}},
                        {"layout-params.y": {presence: true, isNumber: true}}
                    ]
                }
            },
            {
                "#": {
                    oneOf: [
                        {"w": {presence: true, isNumber: true}},
                        {"layout-params.w": {presence: true, isNumber: true}}
                    ]
                }
            },
            {
                "#": {
                    oneOf: [
                        {"h": {presence: true, isNumber: true}},
                        {"layout-params.h": {presence: true, isNumber: true}}
                    ]
                }
            }
        ]
    }
}

exports.StaticLayout = StaticLayout;