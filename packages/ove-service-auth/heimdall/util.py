import json
import logging
import random
import traceback
from typing import Union

import falcon


def get_json_data(req: falcon.Request) -> Union[dict, None]:
    try:
        data = get_raw_data(req)
        return json.loads(data) if data else None
    except Exception:
        raise falcon.HTTPBadRequest("Invalid data", traceback.format_exc())


def get_raw_data(req: falcon.Request) -> Union[str, None]:
    try:
        if req.content_length and req.content_length > 0:
            req_stream = req.bounded_stream.read()
            return req_stream.decode() if isinstance(req_stream, bytes) else req_stream
        else:
            return None
    except Exception:
        raise falcon.HTTPBadRequest("Invalid data", traceback.format_exc())


def parse_logging_lvl(lvl_name: str) -> int:
    if lvl_name:
        lvl_name = lvl_name.strip().upper()
        return logging._nameToLevel.get(lvl_name, logging.INFO)
    else:
        return logging.INFO


def random_string(lenght: int = 10) -> str:
    return "".join(random.sample("abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()?", lenght))
