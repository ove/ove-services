const validate = require("validate.js");
const {translateValidator} = require("../validator/extensions");

class Layout {
    name() {
        return null;
    }

    validators() {
        return {
            "#.layout-params": {presence: true, isNotEmpty: true}
        }
    }

    validate(sectionId, section) {
        let errors = validate({[sectionId]: section}, translateValidator(this.validators(), [sectionId]));
        if (errors) {
            throw errors
        }
    }

    render(sectionId, section, parent) {
    }
}


function shiftCoordinates(parent, section, field) {
    section[field] = section[field] + parent[field];
}

function copyAndShiftCoordinates(parent, section, field) {
    if (!validate.isEmpty(section['layout-params']) && !validate.isEmpty(section['layout-params'][field])) {
        section[field] = section['layout-params'][field] + parent[field];
    }
}

function copyCoordinates(section, field) {
    if (!validate.isEmpty(section['layout-params']) && !validate.isEmpty(section['layout-params'][field])) {
        section[field] = section['layout-params'][field];
    }
}

exports.Layout = Layout;
exports.shiftCoordinates = shiftCoordinates;
exports.copyAndShiftCoordinates = copyAndShiftCoordinates;
exports.copyCoordinates = copyCoordinates;
