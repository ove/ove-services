# Open Visualisation Environment - Services

The OVE Services repository contains microservices that provide non-[core](https://github.com/ove/ove) functionality for [Open Visualisation Environment (OVE)](https://ove.readthedocs.io/).

It currently includes:

* An [In-Memory Persistence Provider](packages/ove-service-persistence-inmemory/README.md) that acts as a key-value store
* A [Layout Service](packages/ove-service-layout/README.md) that converts a layout expressed in abstract units (whose interpretation may depend on the dimensions of the space in which it is applied) to a static layout expressed in absolute pixel positions.

The OVE Services are intended to be used as part of a complete installation of OVE.
The [OVE Documentation](https://ove.readthedocs.io/en/stable/) provides [installation instructions](https://ove.readthedocs.io/en/stable/docs/INSTALLATION.html) and a [user guide](https://ove.readthedocs.io/en/stable/docs/USAGE.html).
