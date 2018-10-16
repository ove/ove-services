const validate = require("validate.js");
const {translateValidator} = require("../validator/extensions");

class Layout {
    // There is no point in creating a jest coverage report for this
    // istanbul ignore next
    name() {
        return null;
    }

    validators() {
        return {
            "#.positionConstraints": {presence: true, isNotEmpty: true}
        };
    }

    parentValidators() {
        return {
            "#.geometry": {presence: true, isNotEmpty: true},
            "#.geometry.x": {presence: true, isNumber: true},
            "#.geometry.y": {presence: true, isNumber: true},
            "#.geometry.w": {presence: true, isNumber: true},
            "#.geometry.h": {presence: true, isNumber: true},
        };
    }

    validate(section, parent) {
        let errors = {};
        let vErrors = validate({[section.name]: section}, translateValidator(this.validators(), [section.name]));
        vErrors && (errors = {...errors, ...vErrors});

        vErrors = validate({[parent.name]: parent}, translateValidator(this.parentValidators(), [parent.name]));
        vErrors && (errors = {...errors, ...vErrors});

        return validate.isEmpty(errors) ? null : errors;
    }

    // Even though in JS method override can work without this, I am disabling linting for clarity
    //eslint-disable-next-line
    render(section, parent) {
    }
}

exports.Layout = Layout;

function initGeometry(section) {
    if (!section.geometry) {
        section.geometry = {};
    }
}

exports.shiftCoordinates = function (parent, section, field) {
    initGeometry(section);
    section.geometry[field] = section.geometry[field] + parent.geometry[field];
};

exports.copyAndShiftCoordinates = function (parent, section, field) {
    let params = section.positionConstraints;
    initGeometry(section);
    section.geometry[field] = params[field] + parent.geometry[field];
};

exports.copyCoordinates = function (section, field) {
    let params = section.positionConstraints;
    initGeometry(section);
    section.geometry[field] = params[field];
};