# Working example

```json
{
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
}
```

Should return:

```json
{  
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
            "app": {},
            "geometry": {
              "x": 16,
              "y": 70,
              "w": 25,
              "h": 100
            }
          }
        ],
        "geometry": {
          "x": 10,
          "y": 20,
          "w": 100,
          "h": 200
        }
      }
    ],
    "geometry": {
      "x": 0,
      "y": 0,
      "w": 30720,
      "h": 4320
    }
  }
}
```