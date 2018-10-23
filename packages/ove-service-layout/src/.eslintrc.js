module.exports = {
    env: {
        node: true,
        es6: true,
        "jest/globals": true
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        indent: ["error", 4],
        "linebreak-style": [
            "error",
            "unix"
        ],
        quotes: [
            "error",
            "double",
            {"allowTemplateLiterals": true}
        ],
        semi: [
            "error",
            "always"
        ],
        "no-useless-concat": "warn"
    },
    plugins: ["jest"]
};