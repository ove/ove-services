from wsgiref import simple_server

from heimdall import setup_app


# do not use this in production
# this is a dev only method provided for convenience
def main():
    app = setup_app(jwt_key="super_secret_stuff")
    httpd = simple_server.make_server('0.0.0.0', 8080, app)
    httpd.serve_forever()


if __name__ == '__main__':
    main()
