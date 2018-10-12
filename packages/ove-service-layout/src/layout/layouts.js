const validate = require("validate.js");
const {translateValidator} = require("../validator/extensions");

class Layout {
    name() {
        return null;
    }

    validators() {
        return {
            "#.position-constraints": {presence: true, isNotEmpty: true}
        }
    }

    parentValidators() {
        return {}
    }

    validate(section, parent) {
        let errors = {};
        let vErrors = validate({[section.name]: section}, translateValidator(this.validators(), [section.name]));
        vErrors && (errors = {...errors, ...vErrors});

        let pValidators = this.parentValidators();
        if (pValidators && !validate.isEmpty(pValidators)) {
            vErrors = validate({[parent.name]: parent}, translateValidator(pValidators, [parent.name]));
            vErrors && (errors = {...errors, ...vErrors});
        }

        return validate.isEmpty(errors) ? null : errors;
    }

    render(section, parent) {
    }
}


function shiftCoordinates(parent, section, field) {
    initGeometry(section);
    section.geometry[field] = section.geometry[field] + parent.geometry[field];
}

function copyAndShiftCoordinates(parent, section, field) {
    if (!validate.isEmpty(section['position-constraints']) && !validate.isEmpty(section['position-constraints'][field])) {
        initGeometry(section);
        section.geometry[field] = section['position-constraints'][field] + parent.geometry[field];
    }
}

function copyCoordinates(section, field) {
    if (!validate.isEmpty(section['position-constraints']) && !validate.isEmpty(section['position-constraints'][field])) {
        initGeometry(section);
        section.geometry[field] = section['position-constraints'][field];
    }
}

function initGeometry(section) {
    if (!section.geometry) {
        section.geometry = {};
    }
}

exports.Layout = Layout;
exports.shiftCoordinates = shiftCoordinates;
exports.copyAndShiftCoordinates = copyAndShiftCoordinates;
exports.copyCoordinates = copyCoordinates;
