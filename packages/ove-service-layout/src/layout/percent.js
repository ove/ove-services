const {Layout, shiftCoordinates} = require("./layouts");

class PercentLayout extends Layout {
    name() {
        return "percent";
    }

    render(section, parent) {
        let params = section.positionConstraints;

        section.geometry = {
            x: Math.round(params.x * parent.geometry.w),
            y: Math.round(params.y * parent.geometry.h)
        };

        shiftCoordinates(parent, section, "x");
        shiftCoordinates(parent, section, "y");

        section.geometry.w = Math.round(params.w * parent.geometry.w);
        section.geometry.h = Math.round(params.h * parent.geometry.h);
    }

    validators() {
        return {
            ...super.validators(),
            "#.positionConstraints.x": {presence: true, isPercent: true},
            "#.positionConstraints.y": {presence: true, isPercent: true},
            "#.positionConstraints.w": {presence: true, isPercent: true},
            "#.positionConstraints.h": {presence: true, isPercent: true},
        };
    }
}

exports.PercentLayout = PercentLayout;