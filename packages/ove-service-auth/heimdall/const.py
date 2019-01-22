FIELD_ID = "id"
FIELD_PASSWORD = "password"
FIELD_AUTH_TOKEN = "AUTH_TOKEN"
FIELD_ACCESS_TOKENS = "ACCESS_TOKENS"
# location of the auth token, used by the login api
FIELD_TOKEN_TARGET = "target"
TOKEN_TARGET_COOKIE = "cookie"
TOKEN_TARGET_HEADER = "header"
# these are standard JWT conventions used by PyJWT
FIELD_EXPIRATION = "exp"
FIELD_ISSUER = "iss"
# lock constants
FIELD_LOCK_TOKEN = "LOCK_TOKEN"
FIELD_LOCK_STATUS = "status"
LOCK_STATUS_LOCKED = "LOCKED"
LOCK_STATUS_UNLOCKED = "UNLOCKED"

FIELD_ACTION = "action"
ACTION_LOCK = "lock"
ACTION_UNLOCK = "unlock"
ACTION_REFRESH = "refresh"
