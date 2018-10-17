let {normalizePort, convertError} = require("./util");

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