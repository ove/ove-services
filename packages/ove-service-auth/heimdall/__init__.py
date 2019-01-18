import logging
from secrets import token_urlsafe

import falcon

from heimdall.middleware import AuthMiddleware
from heimdall.managers import UserManager, AccessManager, ServiceProxyManager
from heimdall.proxy import ProxyAdapter
from heimdall.routes import LoginResource
from heimdall.util import parse_logging_lvl


def setup_app(
        jwt_key: str = token_urlsafe(32), jwt_token_issuer: str = "heimdall", logging_level: str = "debug",
        access_enabled: bool = True, access_config: str = "db/access.json",
        login_enabled: bool = True, login_config: str = "db/users.json", login_hash_passwords: bool = True,
        proxy_enabled: bool = True, proxy_config: str = "db/services.json", proxy_forward: str = ""
) -> falcon.API:
    logging.basicConfig(level=parse_logging_lvl(logging_level), format='[%(asctime)s] [%(levelname)s] %(message)s')

    if access_enabled and not login_enabled:
        raise Exception("ERROR: You can't disable the User Manager while Access Control is enabled")

    if access_enabled:
        access_manager = AccessManager()
        access_manager.load(config_path=access_config)
    else:
        access_manager = None

    if login_enabled:
        user_manager = UserManager()
        user_manager.load(config_path=login_config, hash_passwords=login_hash_passwords)
    else:
        user_manager = None

    _middleware = []

    if login_enabled:
        _middleware.append(AuthMiddleware(jwt_key=jwt_key, jwt_token_issuer=jwt_token_issuer,
                                          access_manager=access_manager, public_paths={"/auth/login"}))

    app = falcon.API(middleware=_middleware)

    if login_enabled:
        app.add_route(uri_template='/auth/login',
                      resource=LoginResource(manager=user_manager, jwt_key=jwt_key, jwt_token_issuer=jwt_token_issuer))

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
        app.add_sink(prefix=r'/(?P<service>.+)/api/(?P<path>.*)', sink=ProxyAdapter(service_manager))

    return app
