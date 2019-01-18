#!/usr/bin/env bash

scriptPath=$(dirname "$(readlink -f "$0")")
cd ${scriptPath}/

[[ ! -z "${GUNICORN_PORT}" ]] || GUNICORN_PORT="8080"
[[ ! -z "${GUNICORN_HOST}" ]] || GUNICORN_HOST="0.0.0.0"
[[ ! -z "${GUNICORN_WORKERS}" ]] || GUNICORN_WORKERS="1"
[[ ! -z "${GUNICORN_THREADS}" ]] || GUNICORN_THREADS="4"

[[ ! -z "${JWT_TOKEN}" ]] || JWT_TOKEN="FDBfaWrqIFjX16duzpJ9ppTaMF0hN8EU"
[[ ! -z "${JWT_ISSUER}" ]] || JWT_ISSUER="heimdall"

[[ ! -z "${SERVICE_LOG_LEVEL}" ]] || SERVICE_LOG_LEVEL="info"

[[ ! -z "${SERVICE_ACCESS_ENABLED}" ]] || SERVICE_ACCESS_ENABLED="True" # python convention for bool variables
[[ ! -z "${SERVICE_ACCESS_CONFIG}" ]] || SERVICE_ACCESS_CONFIG="db/access.json"

[[ ! -z "${SERVICE_LOGIN_ENABLED}" ]] || SERVICE_LOGIN_ENABLED="True" # python convention for bool variables
[[ ! -z "${SERVICE_LOGIN_CONFIG}" ]] || SERVICE_LOGIN_CONFIG="db/users.json"
[[ ! -z "${SERVICE_LOGIN_HASH_PASSWORDS}" ]] || SERVICE_LOGIN_HASH_PASSWORDS="True" # python convention for bool variables

[[ ! -z "${SERVICE_PROXY_ENABLED}" ]] || SERVICE_PROXY_ENABLED="True" # python convention for bool variables
[[ ! -z "${SERVICE_PROXY_CONFIG}" ]] || SERVICE_PROXY_CONFIG="db/services.json"
[[ ! -z "${SERVICE_GLOBAL_PROXY_URL}" ]] || SERVICE_GLOBAL_PROXY_URL=""


echo "Environment variables:"
echo "  GUNICORN_PORT=${GUNICORN_PORT}"
echo "  GUNICORN_HOST=${GUNICORN_HOST}"
echo "  GUNICORN_WORKERS=${GUNICORN_WORKERS}"
echo "  GUNICORN_THREADS=${GUNICORN_THREADS}"
echo ""
echo "  JWT_TOKEN=${JWT_TOKEN}"
echo "  JWT_ISSUER=${JWT_ISSUER}"
echo ""
echo "  SERVICE_LOG_LEVEL=${SERVICE_LOG_LEVEL}"
echo ""
echo "  SERVICE_ACCESS_ENABLED=${SERVICE_ACCESS_ENABLED}"
echo "  SERVICE_ACCESS_CONFIG=${SERVICE_ACCESS_CONFIG}"
echo ""
echo "  SERVICE_LOGIN_ENABLED=${SERVICE_LOGIN_ENABLED}"
echo "  SERVICE_LOGIN_CONFIG=${SERVICE_LOGIN_CONFIG}"
echo "  SERVICE_LOGIN_HASH_PASSWORDS=${SERVICE_LOGIN_HASH_PASSWORDS}"
echo ""
echo "  SERVICE_PROXY_ENABLED=${SERVICE_PROXY_ENABLED}"
echo "  SERVICE_PROXY_CONFIG=${SERVICE_PROXY_CONFIG}"
echo "  SERVICE_GLOBAL_PROXY_URL=${SERVICE_GLOBAL_PROXY_URL}"
echo ""

## did you activate the virtual environment and install the requirements?
gunicorn -b "${GUNICORN_HOST}:${GUNICORN_PORT}" -w ${GUNICORN_WORKERS} --threads ${GUNICORN_THREADS} \
        "heimdall:setup_app(jwt_key='${JWT_TOKEN}', jwt_token_issuer='${JWT_ISSUER}', logging_level='${SERVICE_LOG_LEVEL}',
                            access_enabled=${SERVICE_ACCESS_ENABLED}, access_config='${SERVICE_ACCESS_CONFIG}',
                            login_enabled=${SERVICE_LOGIN_ENABLED}, login_config='${SERVICE_LOGIN_CONFIG}', login_hash_passwords=${SERVICE_LOGIN_HASH_PASSWORDS},
                            proxy_enabled=${SERVICE_PROXY_ENABLED}, proxy_config='${SERVICE_PROXY_CONFIG}', proxy_forward='${SERVICE_GLOBAL_PROXY_URL}'
        )"