# OVE Persistence Service - InMemory

This service provides persistence for the OVE framework using an in-memory storage implementation. This is also the most straightforward persistence service implementation and is not highly available.

## Registering a Persistence Provider

All persistence providers for OVE implements a common API and can be registered in the same way. However, the providers may have their own configurations, concerning their underlying storage implementations. Such configuration should be made according to the respective provider's documentation.

A persistence provider can be registered with OVE or any OVE App using the following API:

Linux/Mac:

```sh
curl --header "Content-Type: application/json" --request POST --data '{"url": "http://OVE_PERSISTENCE_PROVIDER_HOST:PORT"}' http://OVE_CORE_OR_APP_HOST:PORT/persistence
```

Windows:

```sh
curl --header "Content-Type: application/json" --request POST --data "{\"url\": \"http://OVE_PERSISTENCE_PROVIDER_HOST:PORT\"}" http://OVE_CORE_OR_APP_HOST:PORT/persistence
```

A persistence provider can be unregistered from OVE or any OVE App using the following API:

Linux/Mac/Windows:

```sh
curl --header "Content-Type: application/json" --request DELETE  http://OVE_CORE_OR_APP_HOST:PORT/persistence
```
