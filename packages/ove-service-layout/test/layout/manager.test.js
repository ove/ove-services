const {layoutManager, registerAllLayouts} = require("../../src/layout/manager");

registerAllLayouts();

test("Test layouts", () => {
    expect(Object.keys(layoutManager.layouts)).toContain("static");
    expect(Object.keys(layoutManager.layouts)).toContain("grid");
    expect(Object.keys(layoutManager.layouts)).toContain("percent");
});

test("Render valid", () => {
    let oveSpace = {x: 0, y: 0, w: 100, h: 100};

    let body = {
        "oveSpace": "http://localhost:3004/space-info",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "grid",
                        "cols": 16,
                        "rows": 4
                    },
                    "positionConstraints": {
                        "x": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    },
                    "sections": [
                        {
                            "name": "section1",
                            "type": "section",
                            "positionConstraints": {
                                "r": 1,
                                "c": 1,
                                "w": 4,
                                "h": 2
                            },
                            "app": {}
                        }
                    ]
                }
            ]
        }
    };

    expect(() => layoutManager.renderCanvas(body, oveSpace)).not.toThrow();

    body = {
        "oveSpace": {
            "geometry": {
                "x": 0,
                "y": 0,
                "w": 100,
                "h": 100
            }
        },
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "grid",
                        "cols": 16,
                        "rows": 4
                    },
                    "positionConstraints": {
                        "x": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    },
                    "sections": [
                        {
                            "name": "section1",
                            "type": "section",
                            "positionConstraints": {
                                "r": 1,
                                "c": 1,
                                "w": 4,
                                "h": 2
                            },
                            "app": {}
                        }
                    ]
                }
            ]
        }
    };

    expect(() => layoutManager.renderCanvas(body, oveSpace)).not.toThrow();
});

test("Render invalid - invalid container type", () => {
    let oveSpace = {x: 0, y: 0, w: 100, h: 100};

    let body = {
        "oveSpace": "http://localhost:3004/space-info",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container1",
                    "layout": {
                        "type": "grid",
                        "cols": 16,
                        "rows": 4
                    },
                    "positionConstraints": {
                        "x": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    },
                    "sections": [
                        {
                            "name": "section1",
                            "type": "section",
                            "positionConstraints": {
                                "r": 1,
                                "c": 1,
                                "w": 4,
                                "h": 2
                            },
                            "app": {}
                        }
                    ]
                }
            ]
        }
    };
    expect(() => layoutManager.renderCanvas(body, oveSpace)).toThrow();
});

test("Render invalid - invalid section type", () => {
    let oveSpace = {x: 0, y: 0, w: 100, h: 100};

    let body = {
        "oveSpace": "http://localhost:3004/space-info",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "grid",
                        "cols": 16,
                        "rows": 4
                    },
                    "positionConstraints": {
                        "x": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    },
                    "sections": [
                        {
                            "name": "section1",
                            "type": "section1",
                            "positionConstraints": {
                                "r": 1,
                                "c": 1,
                                "w": 4,
                                "h": 2
                            },
                            "app": {}
                        }
                    ]
                }
            ]
        }
    };
    expect(() => layoutManager.renderCanvas(body, oveSpace)).toThrow();
});

test("Render invalid - invalid container types", () => {
    let oveSpace = {x: 0, y: 0, w: 100, h: 100};

    let body = {
        "oveSpace": "http://localhost:3004/space-info",
        "canvas": {
            "layout": {
                "type": "unknown"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "grid",
                        "cols": 16,
                        "rows": 4
                    },
                    "positionConstraints": {
                        "x": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    },
                    "sections": [
                        {
                            "name": "section1",
                            "type": "section",
                            "positionConstraints": {
                                "r": 1,
                                "c": 1,
                                "w": 4,
                                "h": 2
                            },
                            "app": {}
                        }
                    ]
                }
            ]
        }
    };
    expect(() => layoutManager.renderCanvas(body, oveSpace)).toThrow();

    body = {
        "oveSpace": "http://localhost:3004/space-info",
        "canvas": {
            "layout": {
                "type": null
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "grid",
                        "cols": 16,
                        "rows": 4
                    },
                    "positionConstraints": {
                        "x": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    },
                    "sections": [
                        {
                            "name": "section1",
                            "type": "section",
                            "positionConstraints": {
                                "r": 1,
                                "c": 1,
                                "w": 4,
                                "h": 2
                            },
                            "app": {}
                        }
                    ]
                }
            ]
        }
    };
    expect(() => layoutManager.renderCanvas(body, oveSpace)).toThrow();
});

test("Render invalid - section error", () => {
    let oveSpace = {x: 0, y: 0, w: 100, h: 100};

    let body = {
        "oveSpace": "http://localhost:3004/space-info",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "grid",
                        "cols": 16,
                        "rows": 4
                    },
                    "positionConstraints": {
                        "c": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    },
                    "sections": [
                        {
                            "name": "section1",
                            "type": "section",
                            "positionConstraints": {
                                "r": 1,
                                "c": 1,
                                "w": 4,
                                "h": 2
                            },
                            "app": {}
                        }
                    ]
                }
            ]
        }
    };
    expect(() => layoutManager.renderCanvas(body, oveSpace)).toThrow();
});
