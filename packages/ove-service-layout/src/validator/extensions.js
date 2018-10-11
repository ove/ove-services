const validate = require("validate.js");

validate.validators.isIn = (value, options) => options.includes(value) ? null : `should be one of [${options}]`;
validate.validators.isEqual = (value, options) => options === value ? null : `shouldn't be equal to ${options}`;
validate.validators.isNotEqual = (value, options) => options === value ? null : `should be equal to ${options}`;
validate.validators.isNotEmpty = (value) => validate.isEmpty(value) ? `can't be empty` : null;
validate.validators.isNumber = (value) => validate.isNumber(value) ? null : `should be a number`;
validate.validators.isPercent = (value) => validate.isNumber(value) && value >= 0 && value <= 1 ? null : `should be between [0, 1]`;

validate.validators.oneOf = (value, options) => {
    let error;

    for (let option of options) {
        error = validate(value, option);
        if (!error) {
            return null
        }
    }
    return error ? error : "does not fit all requirements"
};

const translateValidator = (options, containers) => {
    let result = {};
    for (let k of Object.keys(options)) {
        for (let container of containers) {
            result[k.replace("#", container)] = options[k]
        }
    }
    return result;
};

const sectionValidator = (sections, options) => {
    if (sections) {
        let errors = validate(sections, translateValidator(options, Object.keys(sections)));
        if (errors) {
            return errors
        }

        for (let container of Object.values(sections)) {
            if (container.type === "container" && !validate.isEmpty(container.sections)) {
                return sectionValidator(container.sections, options);
            }
        }
    }
};

validate.validators.sectionValidator = sectionValidator;

validate.validators.containerValidator = (container) => {
    if (container.type === "container" && validate.isEmpty(container.sections)) {
        return "Sections can't be empty for type === 'container'"
    }
};

exports.translateValidator = translateValidator;