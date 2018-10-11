const {Layout, shiftCoordinates} = require("./layouts");

class GridLayout extends Layout {
    name() {
        return "grid";
    }

    render(sectionId, section, parent) {
        let params = section['layout-params'];
        let cols = params.cols;
        let rows = params.rows;

        let cellWidth = parent.w / cols;
        let cellHeight = parent.h / rows;

        section.x = Math.round(params.c * cellWidth);
        shiftCoordinates(parent, section, "x");

        section.y = Math.round(params.r * cellHeight);
        shiftCoordinates(parent, section, "y");

        section.w = Math.round(params.w * cellWidth);
        section.h = Math.round(params.h * cellHeight);
    }

    validators() {
        return {
            ...super.validators(),
            "#.layout-params.r": {presence: true, isNumber: true},
            "#.layout-params.c": {presence: true, isNumber: true},
            "#.layout-params.w": {presence: true, isNumber: true},
            "#.layout-params.h": {presence: true, isNumber: true},
            "#.layout-params.cols": {presence: true, isNumber: true},
            "#.layout-params.rows": {presence: true, isNumber: true},
        }
    }
}

exports.GridLayout = GridLayout;