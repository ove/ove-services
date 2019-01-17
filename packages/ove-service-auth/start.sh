#!/usr/bin/env bash

scriptPath=$(dirname "$(readlink -f "$0")")
cd ${scriptPath}/

JWT_TOKEN="FDBfaWrqIFjX16duzpJ9ppTaMF0hN8EU"
JWT_ISSUER="heimdall"

# did you activate the virtual environment and install the requirements?

gunicorn "heimdall:setup_app(jwt_key='${JWT_TOKEN}', jwt_token_issuer='${JWT_ISSUER}')"