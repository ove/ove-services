import logging

import falcon
import requests

from heimdall.managers import ServiceProxyManager


class ProxyAdapter:
    def __init__(self, service_manager: ServiceProxyManager):
        self.service_manager = service_manager

    def __call__(self, req: falcon.Request, resp: falcon.response, service: str, path: str):
        service_url = self.service_manager.get_url(service)
        if service_url:
            result = requests.get(service_url + path, params=req.params, headers=req.headers)
            resp.status = str(result.status_code) + ' ' + result.reason
            resp.content_type = result.headers['content-type']
            resp.body = result.text
        else:
            logging.error("Unable to find the service url for %s", service)
