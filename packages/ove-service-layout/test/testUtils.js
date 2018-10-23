exports.renderAndTestSomeConstraints = function (layout, parent, constraints, expectedGeometry) {
    layout.render(constraints, parent);

    expect(constraints).toEqual({...constraints, ...expectedGeometry});
};
