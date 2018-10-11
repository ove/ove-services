const {Layout, shiftCoordinates} = require("./layouts");

class PercentLayout extends Layout {
    name() {
        return "percent";
    }

    render(sectionId, section, parent) {
        let params = section['layout-params'];

        section.x = Math.round(params.x * parent.w);
        shiftCoordinates(parent, section, "x");

        section.y = Math.round(params.y * parent.h);
        shiftCoordinates(parent, section, "y");

        section.w = Math.round(params.w * parent.w);
        section.h = Math.round(params.h * parent.h);
    }

    validators() {
        return {
            ...super.validators(),
            "#.layout-params.x": {presence: true, isPercent: true},
            "#.layout-params.y": {presence: true, isPercent: true},
            "#.layout-params.w": {presence: true, isPercent: true},
            "#.layout-params.h": {presence: true, isPercent: true},
        }
    }
}

exports.PercentLayout = PercentLayout;