const {GridLayout} = require("../../src/layout/grid");

const layout = new GridLayout();

const {renderAndTestSomeConstraints} = require("../../src/test/testUtils");

test("Name", () => {
    expect(layout.name()).toBe("grid");
});

test("Valid layout", () => {
    expect(layout.validate(
        {positionConstraints: {r: 0, c: 0, w: 1, h: 1}},
        {layout: {rows: 4, cols: 16}, geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).toBeNull();
    expect(layout.validate(
        {name: "name1", type: "section", positionConstraints: {r: 0, c: 0, w: 1, h: 1}},
        {layout: {type: "grid", rows: 4, cols: 16}, geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).toBeNull();

});

test("Layouts with missing bits", () => {
    expect(layout.validate({}, {})).not.toBeNull();
    expect(layout.validate({positionConstraints: {r: 0, c: 0, w: 1, h: 1}}, {})).not.toBeNull();
    expect(layout.validate({}, {layout: {rows: 4, cols: 16}, geometry: {x: 0, y: 0, w: 100, h: 100}})).not.toBeNull();
    expect(layout.validate(
        {positionConstraints: {r: 0, w: 1, h: 1}},
        {layout: {rows: 4, cols: 16}, geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).not.toBeNull();
    expect(layout.validate(
        {positionConstraints: {r: 0, c: "100", w: 1, h: 1}},
        {layout: {rows: 4, cols: 16}, geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).not.toBeNull();
    expect(layout.validate(
        {positionConstraints: {r: 0, c: 100, w: 1, h: 1}},
        {layout: {rows: 4, cols: "10"}, geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).not.toBeNull();
});

test("Rendering 4x16", () => {
    let parent = {
        layout: {rows: 4, cols: 16},
        geometry: {x: 0, y: 0, w: 160, h: 100}
    };

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {r: 0, c: 0, w: 1, h: 1}},
        {geometry: {x: 0, y: 0, w: 10, h: 25}}
    );

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {r: 1, c: 2, w: 2, h: 2}},
        {geometry: {x: 20, y: 25, w: 20, h: 50}}
    );
});

test("Rendering 2x4", () => {
    let parent = {
        layout: {rows: 2, cols: 4},
        geometry: {x: 0, y: 0, w: 160, h: 100}
    };

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {r: 0, c: 0, w: 1, h: 1}},
        {geometry: {x: 0, y: 0, w: 40, h: 50}}
    );

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {r: 1, c: 2, w: 2, h: 2}},
        {geometry: {x: 80, y: 50, w: 80, h: 100}}
    );
});

test("Rendering 4x16 - shifted", () => {
    let parent = {
        layout: {rows: 4, cols: 16},
        geometry: {x: 10, y: 20, w: 160, h: 100}
    };

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {r: 0, c: 0, w: 1, h: 1}},
        {geometry: {x: 10, y: 20, w: 10, h: 25}}
    );

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {r: 1, c: 2, w: 2, h: 2}},
        {geometry: {x: 30, y: 45, w: 20, h: 50}}
    );
});
