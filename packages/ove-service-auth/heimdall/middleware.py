import logging
import sys
from typing import Union

import falcon
import jwt

from heimdall.const import *
from heimdall.managers import AccessManager

_HTTP_IGNORE_METHODS = {'CONNECT', 'HEAD', 'OPTIONS', 'TRACE'}
_HTTP_READ_METHODS = {'GET'}
_HTTP_WRITE_METHODS = {'DELETE', 'PATCH', 'POST', 'PUT'}


class AuthMiddleware:
    def __init__(self, jwt_key: str, jwt_token_issuer: str = "heimdall", access_manager: AccessManager = None,
                 public_paths: set = None):
        self.jwt_key = jwt_key
        self.token_issuer = jwt_token_issuer
        self.access_manager = access_manager
        self.public_paths = public_paths if public_paths is not None else {}

    def process_request(self, req: falcon.Request, _resp: falcon.Response):
        logging.debug("Processing request in AuthMiddleware: ")
        if req.path in self.public_paths:
            logging.debug("This is a public resource which does not need a valid token")
            return

        token = self._parse_and_validate_token(self._get_token(req))
        # authorisation
        if self.access_manager:
            self._check_access(method=req.method, resource=req.path, token=token)

    def _check_access(self, method: str, resource: str, token: dict):
        if method in _HTTP_IGNORE_METHODS:
            return
        elif method in _HTTP_READ_METHODS:
            if not self.access_manager.has_read_access(resource, token.get(FIELD_ACCESS_TOKENS, [])):
                raise falcon.HTTPUnauthorized('Access token required for READ operation',
                                              'Please provide a valid access token as part of the request.',
                                              ['Basic'])
        elif method in _HTTP_WRITE_METHODS:
            if not self.access_manager.has_write_access(resource, token.get(FIELD_ACCESS_TOKENS, [])):
                raise falcon.HTTPUnauthorized('Access token required for WRITE operation',
                                              'Please provide a valid access token as part of the request.',
                                              ['Basic'])

    def _parse_and_validate_token(self, raw_token: str) -> dict:
        if raw_token is None:
            raise falcon.HTTPUnauthorized('Auth token required',
                                          'Please provide an auth token as part of the request.',
                                          ['Basic'])

        try:
            # we use a standard 30s leeway for the expiration validation
            return jwt.decode(jwt=raw_token, key=self.jwt_key, verify=True, leeway=30,
                              issuer=self.token_issuer, algorithms=['HS256'], options={'verify_exp': True})
        except:
            logging.debug("Token validation failed. %s", sys.exc_info()[1])
            raise falcon.HTTPUnauthorized('Authentication required',
                                          ('The provided auth token is not valid. ',
                                           'Please request a new token and try again.'),
                                          ['Basic'])

    @staticmethod
    def _get_token(req: falcon.Request) -> Union[str, None]:
        token = req.get_header(FIELD_AUTH_TOKEN, None)
        if token is None:
            token = req.params.get(FIELD_AUTH_TOKEN, None)
        if token is None:
            token = req.cookies.get(FIELD_AUTH_TOKEN, None)
        return token
