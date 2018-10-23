const fetch = require("node-fetch");
const validate = require("validate.js");

const {validateRequest} = require("../validator/validator");

class OveClient {
    constructor() {
        this.cache = {};
    }

    getConfiguration(url) {
        if (validate.isObject(url)) {
            return Promise.resolve(url);
        }

        if (this.cache[url]) {
            return Promise.resolve(this.cache[url]);
        } else {
            let self = this;
            return fetch(url).then(res => res.json()).then(json => validateResponse(url, json)).then(json => {
                self.cache[url] = json;
                return json;
            });
        }
    }
}

function validateResponse(url, json) {
    try {
        validateRequest("oveResponse", json);
    } catch (e) {
        throw {[`${url}`]: e};
    }
    return json;
}

exports.oveClient = new OveClient();
