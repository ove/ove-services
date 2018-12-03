const validate = require("validate.js");
const {getName} = require("../util");
const {validateRequest} = require("../validator/validator");

const { Utils } = require("@ove-lib/utils")();
const log = Utils.Logger("layout:manager");

class LayoutManager {
    constructor() {
        this.layouts = {};
    }

    register(layout) {
        this.layouts[layout.name()] = layout;
    }

    getLayout(container) {
        if (container.layout.type) {
            if (this.layouts[container.layout.type]) {
                return this.layouts[container.layout.type];
            } else {
                throw `Invalid layout == "${container.layout.type}" selected for ${getName(container)}`;
            }
        } else {
            throw `Invalid empty layout for ${getName(container)}`;
        }
    }

    renderCanvas(body, oveLayout) {
        let result = this.renderContainer({
            ...body.canvas,
            type: "container",
            name: "canvas",
            geometry: {
                x: oveLayout.x,
                y: oveLayout.y,
                w: oveLayout.w,
                h: oveLayout.h
            }
        });
        //delete unused properties
        delete result["name"];
        delete result["type"];
        result = {...body, canvas: result};

        postRenderValidation(result);

        return result;
    }

    renderContainer(container) {
        if (container.type === "container") {
            let layout = this.getLayout(container);
            log.info(`Layout selected ${layout.name()} for ${getName(container)}`);
            for (let section of container.sections) {
                let errors = layout.validate(section, container);
                if (errors) {
                    throw errors;
                }

                layout.render(section, container);

                this.renderContainer(section);
            }
        }
        return container;
    }
}

let manager = new LayoutManager();

function registerAllLayouts() {
    const {StaticLayout} = require("./static");
    const {GridLayout} = require("./grid");
    const {PercentLayout} = require("./percent");


    manager.register(new StaticLayout());
    manager.register(new GridLayout());
    manager.register(new PercentLayout());

    log.info("Available layouts", manager.layouts);
}

exports.layoutManager = manager;
exports.registerAllLayouts = registerAllLayouts;

//--- Utils
// Hopefully this never occurs. We cannot test this without breaking valid code
// istanbul ignore next
function postRenderValidation(result) {
    // make sure we did not break anything
    validateRequest("render", result);

    let errors = validate(result, {
        "canvas.geometry": {presence: true, isNotEmpty: true},
        "canvas.geometry.x": {presence: true, isNumber: true},
        "canvas.geometry.y": {presence: true, isNumber: true},
        "canvas.geometry.w": {presence: true, isNumber: true},
        "canvas.geometry.h": {presence: true, isNumber: true},
        "canvas.sections": {
            sectionValidator: {
                "#.geometry": {presence: true, isNotEmpty: false},
                "#.geometry.x": {presence: true, isNumber: true},
                "#.geometry.y": {presence: true, isNumber: true},
                "#.geometry.w": {presence: true, isNumber: true},
                "#.geometry.h": {presence: true, isNumber: true},
            }
        }
    });
    if (errors) {
        throw errors;
    }
}
