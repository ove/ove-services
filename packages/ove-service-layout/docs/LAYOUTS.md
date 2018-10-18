# Layouts

**Note:** At the moment, all layout parameters are relative to the parent, 
meaning that all their geometries will be shifted by the parent (x,y):

```js
container.x = 50
container.section.x = 30
// the resulting section geometry will be parent + section
container.section.geometry.x = 80
```

## Static

**Name:** static  
**Parent parameters:** n/a  
**Parameters:** 
- x: displacement on the x axis, relative to the parent, **numeric**, **required**
- y: displacement on the y axis, relative to the parent, **numeric**, **required**
- w: width, **numeric**, **required**
- h: height, **numeric**, **required**

## Percent

**Name:** percent  
**Parent parameters:** n/a  
**Parameters:** 
- x: percent of the parent width for displacement on the x axis, relative to the parent, **percent**, **required**
- y: percent of the parent height for displacement on the y axis, relative to the parent, **percent**, **required**
- w: percent of the parent width, **percent**, **required**
- h: percent of the parent height, **percent**, **required**

**Note:** All percent parameters are between \[0, 100\]

## Grid

**Name:** grid  
**Parent parameters:** 
- rows: the number of rows used to partition the parent container, **numeric**, **required**
- cols: the number of rows used to partition the parent container, **numeric**, **required**

**Parameters:** 
- c: number of columns for displacement on the x axis, **numeric**, **required**
- r: number of rows for displacement on the y axis, relative to the parent, **numeric**, **required**
- w: width in number of columns, **numeric**, **required**
- h: height in number of rows, **numeric**, **required**