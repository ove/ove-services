let logger = require('debug')('layout:manager');

class LayoutManager {
    constructor() {
        this.layouts = {}
    }

    register(layout) {
        this.layouts[layout.name()] = layout
    }

    getLayout(containerId, container) {
        if (container.layout) {
            if (this.layouts[container.layout]) {
                return this.layouts[container.layout]
            } else {
                throw `Invalid layout == '${container.layout}' selected for ${containerId}`
            }
        } else {
            return this.layouts["static"]
        }
    }

    renderRoot(rootContainer, oveLayout) {
        return this.renderContainer("root", {
            ...rootContainer,
            x: oveLayout.x,
            y: oveLayout.y,
            w: oveLayout.w,
            h: oveLayout.h
        });
    }

    renderContainer(containerId, container) {
        let layout = this.getLayout(containerId, container);
        if (container.type === "container") {
            for (let sectionId of Object.keys(container.sections)) {
                let section = container.sections[sectionId];

                layout.validate(sectionId, section);
                layout.render(sectionId, section, container);

                this.renderContainer(sectionId, section);
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