const request = require("sync-request");

const Benchmark = require("benchmark");

let suite = new Benchmark.Suite;

const serverUrl = "http://localhost:3000/render";

const {simpleModel, simpleTenSectionModel} = require("./models");

suite.on("cycle", (event) => console.log(String(event.target)))
    .add("Simple single section model", singleModel.bind(this, simpleModel))
    .add("Simple 10 section model", singleModel.bind(this, simpleTenSectionModel))
    .add("Random simple model", randomModel.bind(this, [simpleModel, simpleTenSectionModel]))
    .run({"async": true});


function singleModel(body) {
    request("POST", serverUrl, {json: body});
}

function randomModel(bodies) {
    let idx = Math.floor(Math.random() * bodies.length);
    let body = bodies[idx];
    request("POST", serverUrl, {json: body});
}
