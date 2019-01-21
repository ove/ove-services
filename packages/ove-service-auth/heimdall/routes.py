from datetime import datetime, timedelta
import json
import logging

import falcon
import jwt
import bcrypt

from heimdall.const import *
from heimdall.managers import UserManager, LockManager
from heimdall.util import get_json_data, get_token


class LoginResource:
    def __init__(self, manager: UserManager, jwt_key: str, jwt_token_issuer: str,
                 jwt_token_expiration_seconds: int = 3600):
        self.manager = manager
        self.jwt_key = jwt_key
        self.token_issuer = jwt_token_issuer
        self.token_expiration = timedelta(seconds=jwt_token_expiration_seconds)

    def on_post(self, req: falcon.Request, resp: falcon.Response):
        data = get_json_data(req)
        if data is None:
            raise falcon.HTTPBadRequest("Invalid data", "The login data should not be empty")

        unique_id = data.get("id", None)
        password = data.get("password", "")
        user = self.manager.get_user(unique_id)
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
            logging.debug("Valid user, jwt'ing!")

            payload = {
                FIELD_ID: unique_id,
                FIELD_ACCESS_TOKENS: user.access_tokens,
                FIELD_EXPIRATION: datetime.utcnow() + self.token_expiration,
                FIELD_ISSUER: self.token_issuer
            }

            token = jwt.encode(payload=payload, key=self.jwt_key, algorithm='HS256').decode("utf-8")

            if req.params.get(FIELD_TOKEN_TARGET, None) == "cookie":
                resp.set_cookie(FIELD_AUTH_TOKEN, token, path="/")
            elif req.params.get(FIELD_TOKEN_TARGET, None) == "header":
                resp.set_header(FIELD_AUTH_TOKEN, token)
            else:
                resp.body = json.dumps({FIELD_AUTH_TOKEN: token})
        else:
            raise falcon.HTTPUnauthorized('Who Do You Think You Are?',
                                          'Bad id/password combination, please try again',
                                          ['Basic'])


class LockResource:
    def __init__(self, manager: LockManager):
        self.manager = manager

    def on_post(self, req: falcon.Request, resp: falcon.Response):
        data = get_json_data(req)
        if data is None:
            raise falcon.HTTPBadRequest("Invalid data", "The lock data should not be empty")

        action = data.get(FIELD_ACTION, None)
        key = get_token(req, field=FIELD_LOCK_TOKEN)

        if action == ACTION_LOCK:
            if self.manager.lock(key):
                # we are printing this lock on the highest logging level to make sure that a system admin
                # will always be able to unlock the api if he looks at the logs
                logging.critical("API LOCK: " + self.manager.get_lock())
                resp.body = json.dumps({FIELD_LOCK_STATUS: LOCK_STATUS_LOCKED})
            else:
                raise falcon.HTTPUnauthorized('Who Do You Think You Are?',
                                              'The provided lock is invalid, please try again',
                                              ['Basic'])
        elif action == ACTION_UNLOCK:
            if self.manager.unlock(key):
                resp.body = json.dumps({FIELD_LOCK_STATUS: LOCK_STATUS_UNLOCKED})
            else:
                raise falcon.HTTPUnauthorized('Who Do You Think You Are?',
                                              'The provided lock is invalid, please try again',
                                              ['Basic'])
        elif action == ACTION_REFRESH:
            if not self.manager.is_locked:
                lock = self.manager.refresh()
                resp.body = json.dumps({FIELD_LOCK_STATUS: LOCK_STATUS_UNLOCKED, FIELD_LOCK_TOKEN: lock})
            else:
                raise falcon.HTTPUnauthorized('Who Do You Think You Are?',
                                              'You cannot just change the key when the api is locked',
                                              ['Basic'])
        else:
            raise falcon.HTTPUnauthorized('Who Do You Think You Are?',
                                          'You need to know what do you want to do before you ask for it',
                                          ['Basic'])

    def on_get(self, _: falcon.Request, resp: falcon.Response):
        if self.manager.is_locked:
            resp.body = json.dumps({FIELD_LOCK_STATUS: LOCK_STATUS_LOCKED})
        else:
            resp.body = json.dumps({FIELD_LOCK_STATUS: LOCK_STATUS_UNLOCKED, FIELD_LOCK_TOKEN: self.manager.get_lock()})
