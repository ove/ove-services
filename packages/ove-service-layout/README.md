# Layout service

Working example:

```json
{"root": {
	"type": "container",
	"layout": "static",
	"sections": {
		"container1": {
			"type": "container", 
			"layout": "percent",
			"layout-params": {
				"x":10,
				"y":20,
				"w":100,
				"h":200
			},
			"sections": {
				"section1": {
					"type": "section",
					"layout-params": {
						"x": 0.1,
						"y": 0.1,
						"w":1,
						"h":1
					}
				}
			}
		}
	}
}}
```

Should return:

```json
{
    "root": {
        "type": "container",
        "layout": "static",
        "sections": {
            "container1": {
                "type": "container",
                "layout": "percent",
                "layout-params": {
                    "x": 10,
                    "y": 20,
                    "w": 100,
                    "h": 200
                },
                "sections": {
                    "section1": {
                        "type": "section",
                        "layout-params": {
                            "x": 0.1,
                            "y": 0.1,
                            "w": 1,
                            "h": 1
                        },
                        "x": 20,
                        "y": 40,
                        "w": 100,
                        "h": 200
                    }
                },
                "x": 10,
                "y": 20,
                "w": 100,
                "h": 200
            }
        },
        "x": 0,
        "y": 0,
        "w": 1920,
        "h": 1080
    }
}
```