import logging
import sys

import falcon
import requests

from heimdall.managers import ServiceProxyManager
from heimdall.util import get_json_data

_HTTP_METHODS_MAPPINGS = {
    'DELETE': requests.delete,
    'GET': requests.get,
    'HEAD': requests.head,
    'OPTIONS': requests.options,
    'PATCH': requests.patch,
    'POST': requests.post,
    'PUT': requests.put,
}


class ProxyAdapter:
    def __init__(self, service_manager: ServiceProxyManager):
        self.service_manager = service_manager

    def __call__(self, req: falcon.Request, resp: falcon.response, path: str, service: str = "*"):
        service_url = self.service_manager.get_url(service)
        if service_url:
            method = _HTTP_METHODS_MAPPINGS.get(req.method)
            if method:
                try:
                    forward_url = service_url + path
                    data = get_json_data(req)
                    logging.debug("[Proxy request] Service = %s Path = %s ForwardUrl = %s Method = %s "
                                  "Data = %s Params = %s Headers = %s",
                                  service, path, forward_url, req.method, data, req.params, req.headers)
                    result = method(forward_url, params=req.params, headers=req.headers, data=data)
                    resp.status = str(result.status_code) + ' ' + result.reason
                    resp.content_type = result.headers['content-type']
                    resp.body = result.text
                    logging.debug("[Proxy response] Service = %s Path = %s ForwardUrl = %s Method = %s "
                                  "Status = %s Result = %s",
                                  service, path, forward_url, req.method, resp.status, resp.body)
                except:
                    logging.error("Proxy gateway error. Service = %s path = %s method = %s. %s",
                                  service, path, req.method, sys.exc_info()[1])
                    raise falcon.HTTPGatewayTimeout("Unable to forward the request to " + service,
                                                    "Please contact service administrator")
            else:
                logging.error("Method not found. Service = %s path = %s method = %s", service, path, req.method)
                raise falcon.HTTPGatewayTimeout("Unable to forward the request to " + service,
                                                "Please contact service administrator")
        else:
            logging.error("Unable to find the service url for %s", service)
