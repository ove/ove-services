const {PercentLayout} = require("../../src/layout/percent");

const layout = new PercentLayout();

const {renderAndTestSomeConstraints} = require("../testUtils");

test("Name", () => {
    expect(layout.name()).toBe("percent");
});

test("Valid layout", () => {
    expect(layout.validate(
        {positionConstraints: {x: 0, y: 0, w: 100, h: 100}},
        {geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).toBeNull();
    expect(layout.validate(
        {name: "name1", type: "section", positionConstraints: {x: 0, y: 0, w: 100, h: 100}},
        {layout: {type: "percent"}, geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).toBeNull();

});

test("Layouts with missing bits", () => {
    expect(layout.validate({}, {})).not.toBeNull();
    expect(layout.validate({positionConstraints: {x: 0, w: 1, h: 1}}, {geometry: {x: 0, y: 0, w: 100, h: 100}})).not.toBeNull();
    expect(layout.validate({positionConstraints: {x: 0, y: "100", w: 1, h: 1}}, {geometry: {x: 0, y: 0, w: 100, h: 100}})).not.toBeNull();
    expect(layout.validate({positionConstraints: {x: 0, y:0, w: 200, h: 1}}, {geometry: {x: 0, y: 0, w: 100, h: 100}})).not.toBeNull();
});

test("Rendering", () => {
    const parent = {geometry: {x: 0, y: 0, w: 100, h: 100}};

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {x: 0, y: 0, w: 100, h: 100}},
        {geometry: {x: 0, y: 0, w: 100, h: 100}}
    );

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {x: 10, y: 20, w: 60, h: 70}},
        {geometry: {x: 10, y: 20, w: 60, h: 70}}
    );
});

test("Rendering - shifted", () => {
    const parent = {geometry: {x: 10, y: 20, w: 100, h: 100}};

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {x: 0, y: 0, w: 100, h: 100}},
        {geometry: {x: 10, y: 20, w: 100, h: 100}}
    );

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {x: 10, y: 20, w: 60, h: 70}},
        {geometry: {x: 20, y: 40, w: 60, h: 70}}
    );
});
