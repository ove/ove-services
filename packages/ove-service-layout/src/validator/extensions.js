const validate = require("validate.js");

const {getName} = require("../util");

validate.validators.isIn = (value, options) => options.includes(value) ? null : `should be one of [${options}]`;
validate.validators.isEqual = (value, options) => options === value ? null : `shouldn't be equal to ${options}`;
validate.validators.isNotEqual = (value, options) => options !== value ? null : `shouldn't be equal to ${options}`;
validate.validators.isNotEmpty = (value) => validate.isEmpty(value) ? `can't be empty` : null;
validate.validators.isNumber = (value) => validate.isNumber(value) ? null : `should be a number`;
validate.validators.isPercent = (value) => validate.isNumber(value) && value >= 0 && value <= 100 ? null : `should be between [0, 100]`;
validate.validators.isString = (value) => validate.isString(value) ? null : `should be a valid string`;

const translateValidator = (options, containers) => {
    let result = {};
    for (let k of Object.keys(options)) {
        for (let container of containers) {
            result[k.replace("#", container)] = options[k];
        }
    }
    return result;
};

const sectionValidator = (sections, options) => {
    let errors = [];
    if (sections) {
        for (let section of sections) {
            let vErrors = validate({[getName(section)]: section}, translateValidator(options, [getName(section)]));
            if (vErrors) {
                errors = [...errors, vErrors];
            }

            if (section.type === "container" && !validate.isEmpty(section.sections)) {
                vErrors = sectionValidator(section.sections, options);
                if (vErrors) {
                    errors = [...errors, ...vErrors];
                }
            }
        }
    }
    return errors.length > 0 ? errors : null;
};

validate.validators.sectionValidator = sectionValidator;

validate.validators.containerValidator = (container) => {
    let errors = [];
    if (container.type === "container") {
        if (validate.isEmpty(container.sections)) {
            errors.push("sections are mandatory for containers");
        }

        if (validate.isEmpty(container.layout)) {
            errors.push("layout property is mandatory for containers");
        } else if (validate.isEmpty(container.layout.type) || !validate.isString(container.layout.type)) {
            errors.push("layout type needs to be a valid non-empty string for containers");
        }
    } else if (container.type === "section") {
        if (container.sections) {
            errors.push("sections can't have subsections");
        }

        if (container.layout) {
            errors.push("sections can't have layouts, please upgrade to container class");
        }
    }
    return errors.length > 0 ? errors : null;
};

exports.translateValidator = translateValidator;
