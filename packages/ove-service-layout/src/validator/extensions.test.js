// custom validator extensions
require("./extensions");

const validate = require("validate.js");

test("isEqual to", () => {
    expect(validate({"field": "value"}, {"field": {isEqual: "value"}})).toBeUndefined();
    expect(validate({"field": "value"}, {"field": {isEqual: "value1"}})).toEqual({"field": ["Field shouldn't be equal to value1"]});
});

test("isNotEqual to", () => {
    expect(validate({"field": "value"}, {"field": {isNotEqual: "value1"}})).toBeUndefined();
    expect(validate({"field": "value"}, {"field": {isNotEqual: "value"}})).toEqual({"field": ["Field shouldn't be equal to value"]});
});