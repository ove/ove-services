const validate = require("validate.js");

validate.validators.isIn = (value, options) => options.includes(value) ? null : `should be one of [${options}]`;
validate.validators.isEqual = (value, options) => options === value ? null : `shouldn't be equal to ${options}`;
validate.validators.isNotEqual = (value, options) => options === value ? null : `should be equal to ${options}`;
validate.validators.isNotEmpty = (value) => validate.isEmpty(value) ? `can't be empty` : null;
validate.validators.isNumber = (value) => validate.isNumber(value) ? null : `should be a number`;
validate.validators.isPercent = (value) => validate.isNumber(value) && value >= 0 && value <= 1 ? null : `should be between [0, 1]`;
validate.validators.isString = (value) => validate.isString(value) ? null : `should be a valid string`;

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
    let errors = [];
    if (sections) {
        for (let section of sections) {
            if (!validate.isEmpty(section.name) && validate.isString(section.name)) {
                let vErrors = validate({[section.name]: section}, translateValidator(options, [section.name]));
                if (vErrors) {
                    errors = [...errors, vErrors];
                }

                if (section.type === "container" && !validate.isEmpty(section.sections)) {
                    vErrors = sectionValidator(section.sections, options);
                    if (vErrors) {
                        errors = [...errors, ...vErrors];
                    }
                }
            } else {
                errors.push("One of the sections has an empty or non-string name")
            }
        }
    }
    return errors.length > 0 ? errors : null;
};

validate.validators.sectionValidator = sectionValidator;

validate.validators.containerValidator = (container) => {
    if (container.type === "container") {
        let errors = [];

        if (validate.isEmpty(container.sections)) {
            errors.push("sections can't be empty for type === 'container'")
        }

        if (validate.isEmpty(container.layout)) {
            errors.push("layout can't be empty for type === 'container'")
        } else if (validate.isEmpty(container.layout.type) || !validate.isString(container.layout.type)) {
            errors.push("layout type needs to be a valid non-empty string for type === 'container'")
        }

        return errors.length > 0 ? errors : null
    }
};

exports.translateValidator = translateValidator;