# Working example

**Note:** The **oveSpaceGeometry** field can be either a valid URL pointing to an OVE space info endpoint or a geometry object, e.g.:

```json
{"oveSpaceGeometry": "http://localhost:3004/spaces/mockup/geometry"}
```

OR

```json
{"oveSpaceGeometry":  {"w": 100, "h": 100}}
```

For the following request, we use an OVE URL:

```json
{
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
}
```

Should return:

```json
{  
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
