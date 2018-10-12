const {Layout, copyAndShiftCoordinates, copyCoordinates} = require("./layouts");

class StaticLayout extends Layout {
    name() {
        return "static"
    }

    render(section, parent) {
        copyAndShiftCoordinates(parent, section, "x");
        copyAndShiftCoordinates(parent, section, "y");
        copyCoordinates(section, "w");
        copyCoordinates(section, "h");
    }

    validators() {
        return {
            ...super.validators(),
            "#.position-constraints.x": {presence: true, isNumber: true},
            "#.position-constraints.y": {presence: true, isNumber: true},
            "#.position-constraints.w": {presence: true, isNumber: true},
            "#.position-constraints.h": {presence: true, isNumber: true},
        }
    }
}

exports.StaticLayout = StaticLayout;