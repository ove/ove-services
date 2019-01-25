const HttpStatus = require('http-status-codes');

module.exports = function (app, log, Utils) {
    let items = {};
    // IMPORTANT: There are a number of checks for undefined, which is required since null, 0, false or '' could all be
    // valid keys/values. None of the operations involving a single key provides any logs to avoid log-overflow. These
    // methods do provide logs should anything fail.
    const getKeys = function (req, res) {
        if (!req.url.substring(1)) {
            let result = {};
            Object.keys(items).forEach(function (appName) {
                Object.keys(items[appName]).forEach(function (item) {
                    result[appName + '/' + item] = items[appName][item].timestamp;
                });
            });
            log.debug('Getting list of all keys');
            Utils.sendMessage(res, HttpStatus.OK, JSON.stringify(result));
        } else {
            const key = req.url.substring(1).replace(/%2(F|f)/g, '/');
            if (key.indexOf('/') === -1) {
                const appItems = items[key];
                if (appItems === undefined) {
                    Utils.sendEmptySuccess(res);
                } else {
                    let result = {};
                    Object.keys(appItems).forEach(function (item) {
                        result[item] = appItems[item].timestamp;
                    });
                    log.debug('Getting list of keys of app:', key);
                    Utils.sendMessage(res, HttpStatus.OK, JSON.stringify(result));
                }
            } else {
                const appName = key.substring(0, key.indexOf('/'));
                const appKey = key.substring(key.indexOf('/') + 1);
                if (items[appName] === undefined || items[appName][appKey] === undefined) {
                    log.error('Key not found', 'app:', appName, 'key:', appKey);
                    Utils.sendMessage(res, HttpStatus.NOT_FOUND, JSON.stringify({ error: 'key not found' }));
                } else {
                    Utils.sendMessage(res, HttpStatus.OK, JSON.stringify(items[appName][appKey]));
                }
            }
        }
    };

    const deleteKey = function (req, res) {
        if (!req.url.substring(1)) {
            log.error('Key not provided');
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST, JSON.stringify({ error: 'key not provided' }));
        } else {
            const key = req.url.substring(1).replace(/%2(F|f)/g, '/');
            if (key.indexOf('/') === -1) {
                log.error('Invalid', 'key:', key);
                Utils.sendMessage(res, HttpStatus.BAD_REQUEST, JSON.stringify({ error: 'invalid key' }));
            } else {
                const appName = key.substring(0, key.indexOf('/'));
                const appKey = key.substring(key.indexOf('/') + 1);
                if (items[appName] === undefined) {
                    log.error('Invalid key,', 'app:', appName, 'key:', appKey);
                    Utils.sendMessage(res, HttpStatus.BAD_REQUEST, JSON.stringify({ error: 'invalid key' }));
                } else if (items[appName][appKey] === undefined) {
                    log.error('Key not found', 'app:', appName, 'key:', appKey);
                    Utils.sendMessage(res, HttpStatus.NOT_FOUND, JSON.stringify({ error: 'key not found' }));
                } else {
                    delete items[appName][appKey];
                    Utils.sendEmptySuccess(res);
                }
            }
        }
    };

    const setKey = function (req, res) {
        if (!req.url.substring(1)) {
            log.error('Key not provided');
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST, JSON.stringify({ error: 'key not provided' }));
        } else if (req.body.value === undefined || req.body.type === undefined || req.body.timestamp === undefined) {
            log.error('Invalid item:', JSON.stringify(req.body));
            Utils.sendMessage(res, HttpStatus.BAD_REQUEST, JSON.stringify({ error: 'invalid item' }));
        } else {
            const key = req.url.substring(1).replace(/%2(F|f)/g, '/');
            if (key.indexOf('/') === -1) {
                log.error('Invalid', 'key:', key);
                Utils.sendMessage(res, HttpStatus.BAD_REQUEST, JSON.stringify({ error: 'invalid key' }));
            } else {
                const appName = key.substring(0, key.indexOf('/'));
                const appKey = key.substring(key.indexOf('/') + 1);
                if (items[appName] === undefined) {
                    items[appName] = {};
                }
                items[appName][appKey] = JSON.parse(JSON.stringify(req.body));
                Utils.sendEmptySuccess(res);
            }
        }
    };

    app.get(/^(?=$|[/])/, getKeys);
    app.delete(/^(?=$|[/])/, deleteKey);
    app.post(/^(?=$|[/])/, setKey);
};
