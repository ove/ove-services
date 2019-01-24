import json
import logging
import random
import sys
from typing import Union, List

import bcrypt

from heimdall.util import random_string
from heimdall.entities import User


class DuplicateUserError(Exception):
    pass


class UserManager:
    def __init__(self):
        self._data = dict()

    def load(self, config_path: str, hash_passwords: bool = False):
        # pylint: disable=W0702
        try:
            with open(config_path, mode="r") as fin:
                data = json.loads(fin.read())

            logging.info("Loading %s user(s) from config file %s", len(data), config_path)

            for item in data:
                user = User(**item)
                if hash_passwords:
                    user.password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
                else:
                    user.password = user.password.encode('utf-8')

                self._data[user.id] = user
        except:
            logging.error("Unable to load user config = %s. %s", config_path, sys.exc_info()[1])

    def add_user(self, user: User):
        if user.id in self._data:
            raise DuplicateUserError()
        else:
            user_clone = User(**user._asdict())
            user_clone.password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
            self._data[user.id] = user_clone

    def remove_user(self, unique_id: str):
        if unique_id in self._data:
            del self._data[unique_id]

    def get_user(self, unique_id: str) -> Union[User, None]:
        return self._data.get(unique_id, None) if unique_id else None


class AccessManager:
    def __init__(self):
        self._write_tokens = set()
        self._read_tokens = set()

    def load(self, config_path: str):
        # pylint: disable=W0702
        try:
            with open(config_path, mode="r") as fin:
                data = json.loads(fin.read())

            read_tokens = data.get("read", [])
            write_tokens = data.get("write", [])

            logging.info("Loading %s access token(s) from config file %s", len(read_tokens) + len(write_tokens),
                         config_path)

            self._read_tokens.update(read_tokens)
            self._write_tokens.update(write_tokens)
        except:
            logging.error("Unable to load access config = %s. %s", config_path, sys.exc_info()[1])

    def has_read_access(self, resource: str, tokens: List[str]) -> bool:
        logging.info("Checking resource %s for read access", resource)
        # todo; implement a proper protocol for resource access checking
        for token in tokens:
            if token in self._read_tokens:
                return True

            # by default all write tokens have read access
            if token in self._write_tokens:
                return True

        return False

    def has_write_access(self, resource: str, tokens: List[str]) -> bool:
        logging.info("Checking resource %s for write access", resource)
        # todo; implement a proper protocol for resource access checking
        for token in tokens:
            if token in self._write_tokens:
                return True

        return False


class ServiceProxyManager:
    def __init__(self):
        self._data = dict()

    def load(self, config_path: str):
        # pylint: disable=W0702
        try:
            with open(config_path, mode="r") as fin:
                data = json.loads(fin.read())

            logging.info("Loading %s service(s) from config file %s", len(data), config_path)

            for k, v in data.items():
                # todo; check if the url starts with the right protocol
                self._data[k] = []
                if isinstance(v, (list, tuple)):
                    for item in v:
                        self._data[k].append(_normalize_url(item))
                elif isinstance(v, str):
                    self._data[k].append(_normalize_url(v))

        except:
            logging.error("Unable to load service config = %s. %s", config_path, sys.exc_info()[1])

    def add_service(self, service_name: str, service_url: str):
        services = self._data.get(service_name, [])
        services.append(_normalize_url(service_url))
        self._data[service_name] = services

    def get_url(self, service_name: str) -> Union[str, None]:
        services = self._data.get(service_name, [])
        if len(services) == 0:
            return None
        elif len(services) == 1:
            return services[0]
        else:
            # load balancing the hell out of it
            # this does not need to be secure
            return random.choice(services)  # nosec


class LockManager:
    def __init__(self, key_length: int = 8):
        self._key_length = key_length
        self._key = random_string(self._key_length)

        self.is_locked = False

    def refresh(self):
        self._key = random_string(self._key_length)
        return self._key

    def lock(self, key: str) -> Union[str, None]:
        if self.validate(key):
            self.is_locked = True
            return self._key
        else:
            return None

    def unlock(self, key: str) -> Union[str, None]:
        if self.validate(key):
            self.is_locked = False
            return self.refresh()
        else:
            return None

    def validate(self, key: str) -> bool:
        return key == self._key

    def get_lock(self) -> str:
        return self._key


def _normalize_url(item: str) -> str:
    return item if item.endswith("/") else item + "/"
