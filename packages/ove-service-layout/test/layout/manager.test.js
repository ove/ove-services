const { layoutManager, registerAllLayouts } = require("../../src/layout/manager");

registerAllLayouts();

test("Test layouts", () => {
    expect(Object.keys(layoutManager.layouts)).toContain("static");
    expect(Object.keys(layoutManager.layouts)).toContain("grid");
    expect(Object.keys(layoutManager.layouts)).toContain("percent");
});

test("Render valid", () => {
    let oveSpaceGeometry = { x: 0, y: 0, w: 100, h: 100 };

    let body = {
        "oveSpaceGeometry": "http://localhost:3004/spaces/mockup/geometry",
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

    expect(() => layoutManager.renderCanvas(body, oveSpaceGeometry)).not.toThrow();

    body = {
        "oveSpaceGeometry": {
            "w": 100,
            "h": 100
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

    expect(() => layoutManager.renderCanvas(body, oveSpaceGeometry)).not.toThrow();
});

test("Render invalid - invalid container type", () => {
    let oveSpaceGeometry = { x: 0, y: 0, w: 100, h: 100 };

    let body = {
        "oveSpaceGeometry": "http://localhost:3004/spaces/mockup/geometry",
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
    expect(() => layoutManager.renderCanvas(body, oveSpaceGeometry)).toThrow();
});

test("Render invalid - invalid section type", () => {
    let oveSpaceGeometry = { x: 0, y: 0, w: 100, h: 100 };

    let body = {
        "oveSpaceGeometry": "http://localhost:3004/spaces/mockup/geometry",
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
    expect(() => layoutManager.renderCanvas(body, oveSpaceGeometry)).toThrow();
});

test("Render invalid - invalid container types", () => {
    let oveSpaceGeometry = { x: 0, y: 0, w: 100, h: 100 };

    let body = {
        "oveSpaceGeometry": "http://localhost:3004/spaces/mockup/geometry",
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
    expect(() => layoutManager.renderCanvas(body, oveSpaceGeometry)).toThrow();

    body = {
        "oveSpaceGeometry": "http://localhost:3004/spaces/mockup/geometry",
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
    expect(() => layoutManager.renderCanvas(body, oveSpaceGeometry)).toThrow();
});

test("Render invalid - section error", () => {
    let oveSpaceGeometry = { x: 0, y: 0, w: 100, h: 100 };

    let body = {
        "oveSpaceGeometry": "http://localhost:3004/spaces/mockup/geometry",
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
    expect(() => layoutManager.renderCanvas(body, oveSpaceGeometry)).toThrow();
});
