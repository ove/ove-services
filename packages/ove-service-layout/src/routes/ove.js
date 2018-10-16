let fetch = require("node-fetch");

class OveClient {
    constructor() {
        this.cache = {};
    }

    getConfiguration(url) {
        if (this.cache[url]) {
            return Promise.resolve(this.cache[url]);
        } else {
            let self = this;
            return fetch(url).then(res => res.json()).then(json => {
                self.cache[url] = json;
                return json;
            });
        }
    }
}

exports.oveClient = new OveClient();