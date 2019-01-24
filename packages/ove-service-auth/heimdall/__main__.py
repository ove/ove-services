import logging
from wsgiref import simple_server

from heimdall import setup_app


# do not use this in production
# this is a dev only method provided for convenience
def main():
    app = setup_app()
    logging.critical("Do not use this service in production")
    logging.critical("This method is for development only")
    logging.critical("Use the start.sh script to start the production server")
    simple_server.make_server('0.0.0.0', 8080, app).serve_forever()  # nosec


if __name__ == '__main__':
    main()
