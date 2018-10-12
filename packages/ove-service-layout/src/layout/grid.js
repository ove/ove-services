const {Layout, shiftCoordinates} = require("./layouts");

class GridLayout extends Layout {
    name() {
        return "grid";
    }

    render(section, parent) {
        let params = section['position-constraints'];
        let cols = parent.layout.cols;
        let rows = parent.layout.rows;

        let cellWidth = parent.geometry.w / cols;
        let cellHeight = parent.geometry.h / rows;

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
            "#.position-constraints.r": {presence: true, isNumber: true},
            "#.position-constraints.c": {presence: true, isNumber: true},
            "#.position-constraints.w": {presence: true, isNumber: true},
            "#.position-constraints.h": {presence: true, isNumber: true},
        }
    }

    parentValidators() {
        return {
            ...super.parentValidators(),
            "#.layout.rows": {presence: true, isNumber: true},
            "#.layout.cols": {presence: true, isNumber: true},
        }
    }
}

exports.GridLayout = GridLayout;