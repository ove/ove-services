const {normalizePort, convertError, getName} = require("../src/util");

test("Normalize ports", () => {
    expect(normalizePort(123)).toBe(123);
    expect(normalizePort("123")).toBe(123);
    expect(normalizePort(-23)).toBe(false);
});

test("Convert error", () => {
    expect(convertError("error")).toEqual({errors: ["error"]});
    expect(convertError(["error"])).toEqual({errors: ["error"]});
    expect(convertError({message: "error"})).toEqual({errors: ["error"]});
});


test("Get name", () => {
    expect(getName({name: "name1"})).toEqual("name1");
    expect(getName({name: 123})).toEqual("123");
    expect(getName({})).toEqual("anonymous section");
    expect(getName({name: {}})).toEqual("anonymous section");
    expect(getName({name: {some: "field"}})).toEqual("anonymous object");
    expect(getName({name: null})).toEqual("anonymous section");
    expect(getName({sections: null})).toEqual("anonymous section");
    expect(getName({sections: []})).toEqual("anonymous section");
    expect(getName({sections: [{}]})).toEqual("anonymous container");
});
