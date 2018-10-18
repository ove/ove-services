# OVE Layout Service

![Jest coverage](docs/img/badge-lines.svg) ![node - latest](https://img.shields.io/node/v/@stdlib/stdlib/latest.svg) ![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

The Layout Service can be used to support OVE with more complex layouts,
apart from the absolute coordinates system.

## Build

This service requires a standard npm build, which can be built with lerna (as per instructions)
in the Readme file in the root of this repository.

Alternatively, it can be build and run with standard npm, using the package.json.

## Testing & developing

A standard working example is provided in the [Working Example](docs/WORKING_EXAMPLE.md) document.

Testing this service requires either a working OVE instance or a mocked service. The mocked service
is available as part of this project. To run it:

```bash
npm run start:mockup
```

This will spin up a json mockup rest server, exposing the following url: [http://localhost:3004/space-info](http://localhost:3004/space-info).

## Available layouts

The layouts and parameters are available in the [layouts](docs/LAYOUTS.md) document.

## Unit tests

```bash
> npm run coverage
 
 [PASS]  src/layout/manager.test.js
 [PASS]  src/layout/grid.test.js
 [PASS]  src/validator/validator.test.js
 [PASS]  src/layout/percent.test.js
 [PASS]  src/util.test.js
 [PASS]  src/layout/static.test.js
 [PASS]  src/validator/extensions.test.js
 
|-----------------|----------|----------|----------|----------|-------------------|
| File            |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
|-----------------|----------|----------|----------|----------|-------------------|
| All files       |      100 |      100 |      100 |      100 |                   |
|  src            |      100 |      100 |      100 |      100 |                   |
|   util.js       |      100 |      100 |      100 |      100 |                   |
|  src/layout     |      100 |      100 |      100 |      100 |                   |
|   grid.js       |      100 |      100 |      100 |      100 |                   |
|   layouts.js    |      100 |      100 |      100 |      100 |                   |
|   manager.js    |      100 |      100 |      100 |      100 |                   |
|   percent.js    |      100 |      100 |      100 |      100 |                   |
|   static.js     |      100 |      100 |      100 |      100 |                   |
|  src/test       |      100 |      100 |      100 |      100 |                   |
|   testUtils.js  |      100 |      100 |      100 |      100 |                   |
|  src/validator  |      100 |      100 |      100 |      100 |                   |
|   extensions.js |      100 |      100 |      100 |      100 |                   |
|   validator.js  |      100 |      100 |      100 |      100 |                   |
|-----------------|----------|----------|----------|----------|-------------------|

Test Suites: 7 passed, 7 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        1.899s
Ran all test suites.
```

**Note:** All the rest endpoints are not covered by the jest tests.
