# OVE Persistence Service - In-Memory

This service provides persistence for the OVE framework using an in-memory storage implementation. This is also the most straightforward persistence service implementation and is not highly available.

## Registering a Persistence Service

All persistence services for OVE implements a common API and can be registered in the same way. However, the persistence services may have their own configurations, concerning their underlying storage implementations. Such configuration should be made according to the respective persistence service's documentation.

A persistence service can be registered with OVE using the following API:

Linux/Mac:

```sh
curl --header "Content-Type: application/json" --request POST --data '{"url": "http://OVE_CORE_HOST:PORT/service/persistence/inmemory"}' http://OVE_CORE_HOST:PORT/persistence
```

Windows:

```sh
curl --header "Content-Type: application/json" --request POST --data "{\"url\": \"http://OVE_CORE_HOST:PORT/service/persistence/inmemory\"}" http://OVE_CORE_HOST:PORT/persistence
```

A persistence service can be unregistered from OVE using the following API:

Linux/Mac/Windows:

```sh
curl --header "Content-Type: application/json" --request DELETE  http://OVE_CORE_HOST:PORT/persistence
```

A persistence service can be registered with any OVE app using the following API:

Linux/Mac:

```sh
curl --header "Content-Type: application/json" --request POST --data '{"url": "http://OVE_CORE_HOST:PORT/service/persistence/inmemory"}' http://OVE_CORE_HOST:PORT/app/OVE_APP_NAME/persistence
```

Windows:

```sh
curl --header "Content-Type: application/json" --request POST --data "{\"url\": \"http://OVE_CORE_HOST:PORT/service/persistence/inmemory\"}" http://OVE_CORE_HOST:PORT/app/OVE_APP_NAME/persistence
```

A persistence service can be unregistered from any OVE App using the following API:

Linux/Mac/Windows:

```sh
curl --header "Content-Type: application/json" --request DELETE  http://OVE_CORE_HOST:PORT/app/OVE_APP_NAME/persistence
```
