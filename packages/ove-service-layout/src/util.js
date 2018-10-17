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