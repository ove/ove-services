const validate = require("validate.js");

exports.normalizePort = function (val) {
    let port = parseInt(val, 10);

    if (port >= 0) {
        // Port number
        return port;
    }

    return false;
};

exports.convertError = function (error) {
    let result;
    if (error.message) {
        error = error.message;
    }
    if (Array.isArray(error)) {
        result = {errors: error};
    } else {
        result = {errors: [error]};
    }
    return result;
};

exports.getName = function (section) {
    if (!validate.isEmpty(section.name)) {
        if (validate.isString(section.name)) {
            return section.name;
        } else if (validate.isNumber(section.name)) {
            return section.name.toString();
        } else {
            return "anonymous object";
        }
    } else if (!validate.isEmpty(section.sections)) {
        return "anonymous container";
    } else {
        return "anonymous section";
    }
};
