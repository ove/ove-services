import json
import logging
import random
import sys
from typing import Union, List

import bcrypt

from heimdall.entities import User


class DuplicateUserError(Exception):
    pass


class UserManager:
    def __init__(self):
        self._data = dict()

    def load(self, config_path: str, hash_passwords: bool = False):
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
        try:
            with open(config_path, mode="r") as fin:
                data = json.loads(fin.read())

            logging.info("Loading %s service(s) from config file %s", len(data), config_path)

            for k, v in data.items():
                # todo; check if the url starts with the right protocol
                self._data[k] = []
                if isinstance(v, (list, tuple)):
                    for item in v:
                        self._data[k].append(item if item.endswith("/") else item + "/")
                elif isinstance(v, str):
                    self._data[k].append(v if v.endswith("/") else v + "/")

        except:
            logging.error("Unable to service config = %s. %s", config_path, sys.exc_info()[1])

    def get_url(self, service_name: str) -> Union[str, None]:
        services = self._data.get(service_name, [])
        if len(services) == 0:
            return None
        elif len(services) == 1:
            return services[0]
        else:
            # load balancing the hell out of it
            return random.choice(services)
