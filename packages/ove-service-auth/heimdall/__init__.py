import logging

import falcon

from heimdall.middleware import AuthMiddleware, LockMiddleware
from heimdall.managers import UserManager, AccessManager, ServiceProxyManager, LockManager
from heimdall.proxy import ProxyAdapter
from heimdall.routes import LoginResource, LockResource
from heimdall.util import parse_logging_lvl, random_string


def setup_app(
        jwt_key: str = random_string(32), jwt_token_issuer: str = "heimdall", jwt_token_expiration_seconds: int = 3600,
        access_enabled: bool = True, access_config: str = "config/access.json",
        login_enabled: bool = True, login_config: str = "config/users.json", login_hash_passwords: bool = True,
        proxy_enabled: bool = True, proxy_config: str = "config/services.json", proxy_forward: str = "",
        lock_enabled: bool = True, key_length: int = 8, logging_level: str = "debug"
) -> falcon.API:
    logging.basicConfig(level=parse_logging_lvl(logging_level), format='[%(asctime)s] [%(levelname)s] %(message)s')

    if access_enabled and not login_enabled:
        raise Exception("ERROR: You can't disable the User Manager while Access Control is enabled")

    if access_enabled:
        access_manager = AccessManager()
        access_manager.load(config_path=access_config)
    else:
        logging.info("Access control is disabled ...")
        access_manager = None

    if login_enabled:
        user_manager = UserManager()
        user_manager.load(config_path=login_config, hash_passwords=login_hash_passwords)
    else:
        logging.info("Login management is disabled ...")
        user_manager = None

    if lock_enabled:
        lock_manager = LockManager(key_length=key_length)
    else:
        logging.info("API locking is disabled ...")
        lock_manager = None

    _middleware = []

    if login_enabled:
        _middleware.append(AuthMiddleware(jwt_key=jwt_key, jwt_token_issuer=jwt_token_issuer,
                                          access_manager=access_manager, public_paths={"/auth/login"}))

    if lock_enabled:
        _middleware.append(LockMiddleware(manager=lock_manager))

    app = falcon.API(middleware=_middleware)

    if login_enabled:
        lr = LoginResource(manager=user_manager, jwt_key=jwt_key, jwt_token_issuer=jwt_token_issuer,
                           jwt_token_expiration_seconds=jwt_token_expiration_seconds)
        app.add_route(uri_template='/auth/login', resource=lr)

    if lock_enabled:
        app.add_route(uri_template='/auth/lock', resource=LockResource(manager=lock_manager))

    if proxy_forward:
        logging.info("Setting a global proxy for url = %s. This service can't be used as a service proxy anymore ...",
                     proxy_forward)
        service_manager = ServiceProxyManager()
        service_manager.add_service("*", proxy_forward)
        app.add_sink(prefix=r'/(?P<path>.*)', sink=ProxyAdapter(service_manager))
    elif proxy_enabled:
        logging.info("Setting a service proxy. This service can't be used as a global proxy anymore ...")
        service_manager = ServiceProxyManager()
        service_manager.load(config_path=proxy_config)
        app.add_sink(prefix=r'/(?P<service>.+)/(?P<path>.*)', sink=ProxyAdapter(service_manager))
    else:
        logging.info("Proxy is disabled ...")

    return app
