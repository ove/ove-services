const {Layout, shiftCoordinates} = require("./layouts");

class PercentLayout extends Layout {
    name() {
        return "percent";
    }

    render(section, parent) {
        super.render(section, parent);

        const params = section.positionConstraints;

        section.geometry = {
            x: Math.round(params.x * parent.geometry.w / 100),
            y: Math.round(params.y * parent.geometry.h / 100)
        };

        shiftCoordinates(parent, section, "x");
        shiftCoordinates(parent, section, "y");

        section.geometry.w = Math.round(params.w * parent.geometry.w / 100);
        section.geometry.h = Math.round(params.h * parent.geometry.h / 100);
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