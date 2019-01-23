# OVE Base Proxy

This is a generic base proxy that supports various configurations, provided either via environment variables or 
configuration files.

## Configurations

### Request Proxy

The request proxy supports two configurations: a global or service-based proxy. The service proxy supports basic
load balancing.

The proxy mechanism is enabled by default, but can be disabled by setting the **SERVICE_PROXY_ENABLED** environment variable to **False**.

In proxy mode the service maps all requests based on a path matching strategy:

```python
r'/(?P<service>.+)/(?P<path>.*)'
```
- the **service** part is missing in global proxy mode. The service should match the name configured in the 
**services.json** file.
- **path** is used in the forwarded request 

#### Global proxy

In **global proxy** mode all requests are forwarded to the provided url. The url is configured using the 
**SERVICE_GLOBAL_PROXY_URL** environment variable. 

**Example:** The proxy is running on **localhost:8080** and service-abc responds to requests on 
**localhost:9090/search/<query>**. We would like to proxy all these requests and map **localhost:8080** -> 
**localhost:9090/search/** therefore the **SERVICE_GLOBAL_PROXY_URL** will be set to **localhost:9090/search/**.

#### Service proxy

In **service proxy** mode, the request are mapped in a similar way, but the mapping rules are described by the 
**services.json** config file. Example:

```json
{
  "ove": [
    "http://localhost:3004/",
    "http://localhost:3005/"
  ]
}
```

In this case, the proxy is running on **localhost:8080** and two ove services are running on **localhost:3004** 
and **localhost:3005**. In case of a request to **locahost:8080/ove/** this will be forwarded to either 
**localhost:3004** or **localhost:3005** by using a very simple load balancing strategy.

**Note**: This proxy service assumes that all the **state synchronisation** is performed by the services.

#### Important note on proxies

The proxy mapping rules are overridden by the rest service mappings. In case authentication and locking are enabled
the proxy will serve these routes instead of proxying the requests. Currently all the auth operations are performed 
under **auth/login** and **auth/lock** routes.

### Authentication

This feature allows users to authenticate with standard username and password. The authentication is performed using 
a standard jwt protocol. The user config, with username and passwords are described in the **config/users.json** file:

```json
[
  {
    "id": "admin",
    "password": "secure-password-123"
  }
]
``` 

**Note:** The user id has to be unique.

All the other authentication parameters can be set using environment variables:

- **SERVICE_LOGIN_ENABLED**: enable the login feature, default is True.
- **SERVICE_LOGIN_CONFIG**: location of the login configuration file, containing the usernames and passwords. The default 
location is  **config/users.json**.
- **SERVICE_LOGIN_HASH_PASSWORDS**: enable the password hashing feature after loading from file, default is True. 
Must be enabled if the passwords are stored in plain text.
- **JWT_TOKEN**: a secure token to be used by the JWT algorithm. By default a secure random password is generated.
- **JWT_ISSUER**: the name of the issuer to be used by the JWT algorithm, default is heimdall. This can be personalized 
to something more secure.
- **JWT_TOKEN_EXPIRATION**: JWT token expiration parameter (in seconds), default is 3600. 

### Authorization

Authorization can be configured for every route by using a read or write token. These can be configured in 
**config/access.json**: 

```json
{
  "read": [
    "very-secure-token"
  ],
  "write": [
    "slightly-more-secure-token-because-it's-longer"
  ]
}
```

When authorization is enabled, the user can be given access via a token by adding this information
to the user profile in the **config/users.json** file:

```json
[
  {
    "id": "admin",
    "password": "secure-password-123",
    "access_tokens": [
      "slightly-more-secure-token-because-it's-longer"
    ]
  }
]
``` 

All the other authorization parameters can be set using environment variables:

- **SERVICE_ACCESS_ENABLED**: enable the authorization feature, default is True.
- **SERVICE_ACCESS_CONFIG**: location of the access configuration file, containing the authorization tokens. The default 
location is  **config/users.json**.

### Locking

API Locking can be performed for the whole API to restrict temporarily the access. All the lock settings can be configured
using environment variables:

- **SERVICE_LOCK_ENABLED**: enable the lock feature, default is True.
- **SERVICE_LOCK_KEY_LENGTH**: length of the lock key, default is 8. The size should be kept to a reasonable low value
to make the feature more user friendly.

### Server configuration

All server configuration parameters can be configured using environment variables: 

- **GUNICORN_PORT** - configures the server bind port, default is 8080. This port needs to be exposed by docker as well.
- **GUNICORN_HOST** - the server hostname to bind, default is 0.0.0.0 which listens on all adapters
- **GUNICORN_WORKERS** - the number of server workers to spawn, default is 1. Workers are processes and can be useful if the 
python implementation does not support multi-threading.
- **GUNICORN_THREADS** - the number of worker threads to spawn, default is 4. If the python implementation supports 
multi-threading, these are lighter than workers.
- **SERVICE_LOG_LEVEL** - the log level for server operations, default is info. These are the python log levels used by 
the standard logging library.

## Token location

All tokens used by various APIs can be provided as either header parameters, query parameters or cookie. 

- **AUTH_TOKEN**: authentication token in a valid JWT format, as provided by the login API
- **LOCK_TOKEN**: lock token, as provided by the lock API

## APIs

### Login

The login api, if enabled, is available on the **/auth/login** route. This api expects a post message with:

```json
{
  "id": "a valid username",
  "password": "a valid password"
}
```

The JWT token is returned by default in the body of the response. A different location (header or cookie) can be 
provided via the **target** query parameter.

### Lock

The lock API, if enabled, is available on the **/auth/lock** route. On GET, the API returns the status of the API: 

```json
{
  "status": "unlocked",
  "LOCK_TOKEN": "key"
}
```

If the API is locked, only the status is returned if the right key is provided. Otherwise a HTTP 423 error is returned.

On POST, the API can be locked, unlocked or refresh by providing different actions. To refresh the key: 

 ```json
{
  "action": "refresh"
}
```

**NOTE**: All lock actions require the current valid lock key.

