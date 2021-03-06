const {Layout, shiftCoordinates} = require("./layouts");

class GridLayout extends Layout {
    name() {
        return "grid";
    }

    render(section, parent) {
        super.render(section, parent);

        const params = section.positionConstraints;
        const cols = parent.layout.cols;
        const rows = parent.layout.rows;

        const cellWidth = parent.geometry.w / cols;
        const cellHeight = parent.geometry.h / rows;

        section.geometry = {
            x: Math.round(params.c * cellWidth),
            y: Math.round(params.r * cellHeight)
        };

        shiftCoordinates(parent, section, "x");
        shiftCoordinates(parent, section, "y");

        section.geometry.w = Math.round(params.w * cellWidth);
        section.geometry.h = Math.round(params.h * cellHeight);
    }

    validators() {
        return {
            ...super.validators(),
            "#.positionConstraints.r": {presence: true, isNumber: true},
            "#.positionConstraints.c": {presence: true, isNumber: true},
            "#.positionConstraints.w": {presence: true, isNumber: true},
            "#.positionConstraints.h": {presence: true, isNumber: true},
        };
    }

    parentValidators() {
        return {
            ...super.parentValidators(),
            "#.layout.rows": {presence: true, isNumber: true},
            "#.layout.cols": {presence: true, isNumber: true},
        };
    }
}

exports.GridLayout = GridLayout;