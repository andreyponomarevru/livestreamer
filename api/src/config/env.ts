const uninit = "uninitialized";

// App Initialization

export const APP_NAME = process.env.APP_NAME || uninit;

export const UPLOADED_PROFILE_PICS_IMG_DIR =
  process.env.UPLOADED_PROFILE_PICS_IMG_DIR || uninit;
export const UPLOADED_BROADCAST_ARTWORKS_IMG_DIR =
  process.env.UPLOADED_BROADCAST_ARTWORKS_IMG_DIR || uninit;

// HTTP Server

export const NODE_HTTP_PORT = Number(process.env.NODE_HTTP_PORT);
export const SHOULD_EXPRESS_TRUST_FIRST_PROXY =
  process.env.SHOULD_EXPRESS_TRUST_FIRST_PROXY === "true";
export const SHOULD_SET_SECURE_SESSION_COOKIE =
  process.env.SHOULD_SET_SECURE_SESSION_COOKIE === "true";
export const SHOULD_TRUST_PROXY_SECURE_SESSION_COOKIE =
  process.env.SHOULD_TRUST_PROXY_SECURE_SESSION_COOKIE === "true";
export const API_URL_PREFIX = process.env.API_URL_PREFIX || uninit;

// WebSocket Server

export const WS_SERVER_URL = process.env.WS_SERVER_URL || uninit;

// Postgres

export const POSTGRES_USER = process.env.POSTGRES_USER || uninit;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || uninit;
export const POSTGRES_HOST = process.env.POSTGRES_HOST || uninit;
export const POSTGRES_DB = process.env.POSTGRES_DB || uninit;
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT || 5432);

// Redis

export const REDIS_URI = process.env.REDIS_URI || uninit;

// Logger

export const SHOULD_LOG_TO_FILE = process.env.SHOULD_LOG_TO_FILE === "true";
export const SHOULD_LOG_TO_CONSOLE =
  process.env.SHOULD_LOG_TO_CONSOLE === "true";
export const LOG_LOCATION = process.env.LOG_LOCATION || uninit;
export const ERROR_LOG_NAME = process.env.ERROR_LOG_NAME || uninit;
export const INFO_LOG_NAME = process.env.INFO_LOG_NAME || uninit;
export const DEBUG_LOG_NAME = process.env.DEBUG_LOG_NAME || uninit;

// Mail service

export const MAIL_FROM_HOST = process.env.MAIL_FROM_HOST || uninit;
export const MAIL_FROM_SERVICE = process.env.MAIL_FROM_SERVICE || uninit;
export const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL || uninit;
export const MAIL_SERVICE_LOGIN = process.env.MAIL_SERVICE_LOGIN || uninit;
export const MAIL_SERVICE_PASSWORD =
  process.env.MAIL_SERVICE_PASSWORD || uninit;
export const MAIL_FROM_PORT = Number(process.env.MAIL_FROM_PORT);

export const EMAIL_CONFIRMATION_LINK =
  process.env.EMAIL_CONFIRMATION_LINK || uninit;
export const SIGN_IN_LINK = process.env.SIGN_IN_LINK || uninit;
export const SUBMIT_NEW_PASSWORD_LINK =
  process.env.SUBMIT_NEW_PASSWORD_LINK || uninit;

// Authentication

export const AUTH_COOKIE_SECRET = process.env.AUTH_COOKIE_SECRET || uninit;
export const COOKIE_NAME = process.env.COOKIE_NAME || uninit;
export const REDIS_COOKIE_EXPIRATION_TTL = Number(
  process.env.REDIS_COOKIE_EXPIRATION_TTL,
);
export const EXPRESS_SESSION_COOKIE_MAXAGE = Number(
  process.env.EXPRESS_SESSION_COOKIE_MAXAGE,
);

// RabbitMQ

export const RABBITMQ_PROTOCOL = process.env.RABBITMQ_PROTOCOL || uninit;
export const RABBITMQ_HOSTNAME = process.env.RABBITMQ_HOSTNAME || uninit;
export const RABBITMQ_PORT = Number(process.env.RABBITMQ_PORT);
export const RABBITMQ_USER = process.env.RABBITMQ_USER || uninit;
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || uninit;
export const RABBITMQ_VHOST = process.env.RABBITMQ_VHOST1 || uninit;
export const RABBITMQ_HEARTBEAT = Number(process.env.RABBITMQ_HEARTBEAT);
