#!/usr/bin/env bash

scriptPath=$(dirname "$(readlink -f "$0")")
cd ${scriptPath}/

[[ ! -z "${GUNICORN_PORT}" ]] || GUNICORN_PORT="8080"
[[ ! -z "${GUNICORN_HOST}" ]] || GUNICORN_HOST="0.0.0.0"
[[ ! -z "${GUNICORN_WORKERS}" ]] || GUNICORN_WORKERS="1"
[[ ! -z "${GUNICORN_THREADS}" ]] || GUNICORN_THREADS="4"

[[ ! -z "${JWT_TOKEN}" ]] || JWT_TOKEN=$(strings /dev/urandom | grep -o '[[:alnum:]]' | head -n 64 | tr -d '\n')
[[ ! -z "${JWT_ISSUER}" ]] || JWT_ISSUER="heimdall"
[[ ! -z "${JWT_TOKEN_EXPIRATION}" ]] || JWT_TOKEN_EXPIRATION="3600"

[[ ! -z "${SERVICE_LOG_LEVEL}" ]] || SERVICE_LOG_LEVEL="info"

[[ ! -z "${SERVICE_ACCESS_ENABLED}" ]] || SERVICE_ACCESS_ENABLED="False" # python convention for bool variables
[[ ! -z "${SERVICE_ACCESS_CONFIG}" ]] || SERVICE_ACCESS_CONFIG="config/access.json"

[[ ! -z "${SERVICE_LOGIN_ENABLED}" ]] || SERVICE_LOGIN_ENABLED="False" # python convention for bool variables
[[ ! -z "${SERVICE_LOGIN_CONFIG}" ]] || SERVICE_LOGIN_CONFIG="config/users.json"
[[ ! -z "${SERVICE_LOGIN_HASH_PASSWORDS}" ]] || SERVICE_LOGIN_HASH_PASSWORDS="True" # python convention for bool variables

[[ ! -z "${SERVICE_PROXY_ENABLED}" ]] || SERVICE_PROXY_ENABLED="False" # python convention for bool variables
[[ ! -z "${SERVICE_PROXY_CONFIG}" ]] || SERVICE_PROXY_CONFIG="config/services.json"
[[ ! -z "${SERVICE_GLOBAL_PROXY_URL}" ]] || SERVICE_GLOBAL_PROXY_URL=""

[[ ! -z "${SERVICE_LOCK_ENABLED}" ]] || SERVICE_LOCK_ENABLED="False" # python convention for bool variables
[[ ! -z "${SERVICE_LOCK_KEY_LENGTH}" ]] || SERVICE_LOCK_KEY_LENGTH="8"

echo "Environment variables:"
echo "  GUNICORN_PORT=${GUNICORN_PORT}"
echo "  GUNICORN_HOST=${GUNICORN_HOST}"
echo "  GUNICORN_WORKERS=${GUNICORN_WORKERS}"
echo "  GUNICORN_THREADS=${GUNICORN_THREADS}"
echo ""
echo "  JWT_TOKEN=${JWT_TOKEN}"
echo "  JWT_ISSUER=${JWT_ISSUER}"
echo "  JWT_TOKEN_EXPIRATION=${JWT_TOKEN_EXPIRATION}"
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
echo "  SERVICE_LOCK_ENABLED=${SERVICE_LOCK_ENABLED}"
echo "  SERVICE_LOCK_KEY_LENGTH=${SERVICE_LOCK_KEY_LENGTH}"
echo ""

## did you activate the virtual environment and install the requirements?
gunicorn -b "${GUNICORN_HOST}:${GUNICORN_PORT}" -w ${GUNICORN_WORKERS} --threads ${GUNICORN_THREADS} \
        "heimdall:setup_app(jwt_key='${JWT_TOKEN}', jwt_token_issuer='${JWT_ISSUER}', jwt_token_expiration_seconds=${JWT_TOKEN_EXPIRATION},
                            access_enabled=${SERVICE_ACCESS_ENABLED}, access_config='${SERVICE_ACCESS_CONFIG}',
                            login_enabled=${SERVICE_LOGIN_ENABLED}, login_config='${SERVICE_LOGIN_CONFIG}', login_hash_passwords=${SERVICE_LOGIN_HASH_PASSWORDS},
                            proxy_enabled=${SERVICE_PROXY_ENABLED}, proxy_config='${SERVICE_PROXY_CONFIG}', proxy_forward='${SERVICE_GLOBAL_PROXY_URL}',
                            lock_enabled=${SERVICE_LOCK_ENABLED}, key_length=${SERVICE_LOCK_KEY_LENGTH},
                            logging_level='${SERVICE_LOG_LEVEL}'
        )"