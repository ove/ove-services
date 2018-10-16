const {PercentLayout} = require("./percent");

let layout = new PercentLayout();

let {renderAndTestSomeConstraints} = require("../test/testUtils");

test("Name", () => {
    expect(layout.name()).toBe("percent");
});

test("Valid layout", () => {
    expect(layout.validate(
        {positionConstraints: {x: 0, y: 0, w: 1, h: 1}},
        {geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).toBeNull();
    expect(layout.validate(
        {name: "name1", type: "section", positionConstraints: {x: 0, y: 0, w: 1, h: 1}},
        {layout: {type: "percent"}, geometry: {x: 0, y: 0, w: 100, h: 100}}
    )).toBeNull();

});

test("Layouts with missing bits", () => {
    expect(layout.validate({}, {})).not.toBeNull();
    expect(layout.validate({positionConstraints: {x: 0, w: 1, h: 1}}, {geometry: {x: 0, y: 0, w: 100, h: 100}})).not.toBeNull();
    expect(layout.validate({positionConstraints: {x: 0, y: "100", w: 1, h: 1}}, {geometry: {x: 0, y: 0, w: 100, h: 100}})).not.toBeNull();
    expect(layout.validate({positionConstraints: {x: 0, y:0, w: 2, h: 1}}, {geometry: {x: 0, y: 0, w: 100, h: 100}})).not.toBeNull();
});

test("Rendering", () => {
    let parent = {geometry: {x: 0, y: 0, w: 100, h: 100}};

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {x: 0, y: 0, w: 1, h: 1}},
        {geometry: {x: 0, y: 0, w: 100, h: 100}}
    );

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {x: 0.1, y: 0.2, w: 0.6, h: 0.7}},
        {geometry: {x: 10, y: 20, w: 60, h: 70}}
    );
});

test("Rendering - shifted", () => {
    let parent = {geometry: {x: 10, y: 20, w: 100, h: 100}};

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {x: 0, y: 0, w: 1, h: 1}},
        {geometry: {x: 10, y: 20, w: 100, h: 100}}
    );

    renderAndTestSomeConstraints(layout, parent,
        {positionConstraints: {x: 0.1, y: 0.2, w: 0.6, h: 0.7}},
        {geometry: {x: 20, y: 40, w: 60, h: 70}}
    );
});