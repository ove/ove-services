import logging

import falcon

from heimdall.middleware import AuthMiddleware
from heimdall.managers import UserManager, AccessManager, ServiceProxyManager
from heimdall.proxy import ProxyAdapter
from heimdall.routes import LoginResource


def setup_app(jwt_key: str, jwt_token_issuer: str = "heimdall", logging_level: int = logging.DEBUG) -> falcon.API:
    logging.basicConfig(level=logging_level, format='[%(asctime)s] [%(levelname)s] %(message)s')

    access_manager = AccessManager()
    access_manager.load(config_path="db/access.json")

    user_manager = UserManager()
    user_manager.load(config_path="db/users.json", hash_passwords=True)

    service_manager = ServiceProxyManager()
    service_manager.load(config_path="db/services.json")

    auth = AuthMiddleware(jwt_key=jwt_key, jwt_token_issuer=jwt_token_issuer, access_manager=access_manager)

    app = falcon.API(middleware=[auth])
    # app = falcon.API()

    app.add_route(uri_template='/auth/login',
                  resource=LoginResource(manager=user_manager, jwt_key=jwt_key, jwt_token_issuer=jwt_token_issuer))

    app.add_sink(prefix=r'/(?P<service>.+)/api/(?P<path>.*)', sink=ProxyAdapter(service_manager))

    return app
