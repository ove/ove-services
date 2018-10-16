let {normalizePort} = require("./util");

test("Normalize ports", () => {
    expect(normalizePort(123)).toBe(123);
    expect(normalizePort("123")).toBe(123);
    expect(normalizePort(-23)).toBe(false);
});