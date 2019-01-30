const HttpStatus = require('http-status-codes');

// IMPORTANT: Do not introduce any logs for operations on a single key, except for error scenarios.
// Logs have been left out from most of the methods on purpose, as it contributes to significant
// log file sizes.
module.exports = function (app, log, Utils) {
    let items = {};
    const getKeys = function (req, res) {
        // Keys do not start with a slash like paths in a URI, and therefore we ignore it. If the
        // path was '/', the key would be an empty string. For all other paths, the first path
        // segment would be the name of app to which the key belongs to. The subsequent segments
        // would correspond to the actual key used in an app.
        if (!req.url.substring(1)) {
            // If the key was an empty string, we return a list for keys belonging to all apps.
            let result = {};
            Object.keys(items).forEach(function (appName) {
                Object.keys(items[appName]).forEach(function (item) {
                    result[appName + '/' + item] = items[appName][item].timestamp;
                });
            });
            log.debug('Getting list of all keys');
            Utils.sendMessage(res, HttpStatus.OK, JSON.stringify(result));
            return;
        }

        const key = req.url.substring(1).replace(/%2(F|f)/g, '/');
        if (key.indexOf('/') === -1) {
            // Unlike in the set and delete methods, the get method accepts paths with a single
            // segment. Such requests would return a list of keys belonging to a specific app.
            const appItems = items[key];
            if (appItems === undefined) {
                Utils.sendEmptySuccess(res);
            } else {
                let result = {};
                Object.keys(appItems).forEach(function (item) {
                    result[item] = appItems[item].timestamp;
                });
                Utils.sendMessage(res, HttpStatus.OK, JSON.stringify(result));
            }
        } else {
            const appName = key.substring(0, key.indexOf('/'));
            const appKey = key.substring(key.indexOf('/') + 1);
            if (items[appName] === undefined || items[appName][appKey] === undefined) {
                log.error('Key not found', 'app:', appName, 'key:', appKey);
                Utils.sendMessage(res, HttpStatus.NOT_FOUND,
                    JSON.stringify({ error: 'key not found' }));
            } else {
                Utils.sendMessage(res, HttpStatus.OK,
                    JSON.stringify(items[appName][appKey]));
            }
        }
    };

    const deleteKey = function (req, res) {
        if (!req.url.substring(1)) {
            log.error('Key not provided');
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST,
                JSON.stringify({ error: 'key not provided' }));
            return;
        }
        const key = req.url.substring(1).replace(/%2(F|f)/g, '/');
        if (key.indexOf('/') === -1) {
            log.error('Invalid key:', key);
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST,
                JSON.stringify({ error: 'invalid key' }));
            return;
        }

        const appName = key.substring(0, key.indexOf('/'));
        const appKey = key.substring(key.indexOf('/') + 1);
        if (items[appName] === undefined) {
            log.error('Invalid key:', appKey, ', app:', appName);
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST,
                JSON.stringify({ error: 'invalid key' }));
        } else if (items[appName][appKey] === undefined) {
            log.error('Key not found', 'app:', appName, 'key:', appKey);
            Utils.sendMessage(res, HttpStatus.NOT_FOUND,
                JSON.stringify({ error: 'key not found' }));
        } else {
            delete items[appName][appKey];
            Utils.sendEmptySuccess(res);
        }
    };

    const setKey = function (req, res) {
        if (!req.url.substring(1)) {
            log.error('Key not provided');
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST,
                JSON.stringify({ error: 'key not provided' }));
            return;
        } else if (req.body.value === undefined || req.body.type === undefined ||
            req.body.timestamp === undefined) {
            log.error('Invalid item:', JSON.stringify(req.body));
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST,
                JSON.stringify({ error: 'invalid item' }));
            return;
        }

        const key = req.url.substring(1).replace(/%2(F|f)/g, '/');
        if (key.indexOf('/') === -1) {
            log.error('Invalid key:', key);
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST,
                JSON.stringify({ error: 'invalid key' }));
            return;
        }

        const appName = key.substring(0, key.indexOf('/'));
        const appKey = key.substring(key.indexOf('/') + 1);
        if (items[appName] === undefined) {
            // We are setting the very first key for an app.
            items[appName] = {};
        }
        items[appName][appKey] = JSON.parse(JSON.stringify(req.body));
        Utils.sendEmptySuccess(res);
    };

    app.get(/^(?=$|[/])/, getKeys);
    app.delete(/^(?=$|[/])/, deleteKey);
    app.post(/^(?=$|[/])/, setKey);
};
