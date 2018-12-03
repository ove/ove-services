const { validateRequest } = require("../../src/validator/validator");

test("Invalid request path", () => {
    expect(() => validateRequest("invalid", {})).not.toThrow();
});

test("Valid request", () => {
    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
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
    })).not.toThrow();
});

test("Invalid request - empty sections", () => {
    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": []
        }
    })).toThrow();

    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            }
        }
    })).toThrow();
});

test("Invalid request - empty layout on canvas", () => {
    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": ""
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
    })).toThrow();

    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {},
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
    })).toThrow();

    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
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
    })).toThrow();
});

test("Invalid request - empty layout on container", () => {
    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "",
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
    })).toThrow();

    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {},
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
    })).toThrow();

    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
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
    })).toThrow();
});

test("Invalid request - empty sections on container", () => {
    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "static",
                    },
                    "positionConstraints": {
                        "x": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    },
                    "sections": []
                }
            ]
        }
    })).toThrow();

    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "container1",
                    "type": "container",
                    "layout": {
                        "type": "static",
                    },
                    "positionConstraints": {
                        "x": 10,
                        "y": 20,
                        "w": 100,
                        "h": 200
                    }
                }
            ]
        }
    })).toThrow();
});

test("Invalid request - sections with layouts", () => {
    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "section1",
                    "type": "section",
                    "layout": {
                        "type": "static"
                    },
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
    })).toThrow();
});

test("Invalid request - sections with sections", () => {
    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "section1",
                    "type": "section",
                    "sections": [],
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
    })).toThrow();
});

test("Invalid request - empty name", () => {
    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "name": "",
                    "type": "section",
                    "sections": [],
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
    })).toThrow();

    expect(() => validateRequest("render", {
        "oveSpaceGeometry": "http://localhost/",
        "canvas": {
            "layout": {
                "type": "static"
            },
            "sections": [
                {
                    "type": "section",
                    "sections": [],
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
    })).toThrow();
});
