const {Layout, copyAndShiftCoordinates, copyCoordinates} = require("./layouts");

class StaticLayout extends Layout {
    name() {
        return "static";
    }

    render(section, parent) {
        super.render(section, parent);

        copyAndShiftCoordinates(parent, section, "x");
        copyAndShiftCoordinates(parent, section, "y");
        copyCoordinates(section, "w");
        copyCoordinates(section, "h");
    }

    validators() {
        return {
            ...super.validators(),
            "#.positionConstraints.x": {presence: true, isNumber: true},
            "#.positionConstraints.y": {presence: true, isNumber: true},
            "#.positionConstraints.w": {presence: true, isNumber: true},
            "#.positionConstraints.h": {presence: true, isNumber: true},
        };
    }
}

exports.StaticLayout = StaticLayout;