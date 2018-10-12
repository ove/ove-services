let logger = require('debug')('layout:manager');

class LayoutManager {
    constructor() {
        this.layouts = {}
    }

    register(layout) {
        this.layouts[layout.name()] = layout
    }

    getLayout(container) {
        if (container.layout.type) {
            if (this.layouts[container.layout.type]) {
                return this.layouts[container.layout.type]
            } else {
                throw `Invalid layout == '${container.layout.type}' selected for ${container.name}`
            }
        } else {
            throw `Invalid empty layout for ${container.name}`
        }
    }

    renderCanvas(canvas, oveLayout) {
        let result = this.renderContainer({
            ...canvas,
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

        //todo; do some post validation and raise warnings

        return result
    }

    renderContainer(container) {
        if (container.type === "container") {
            let layout = this.getLayout(container);
            logger(`Layout selected ${layout.name()} for ${container.name}`);
            for (let section of container.sections) {
                let errors = layout.validate(section, container);
                if (errors) {
                    throw errors
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

    logger("Available layouts", manager.layouts);
}

exports.layoutManager = manager;
exports.registerAllLayouts = registerAllLayouts;