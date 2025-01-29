/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import session from "express-session";
import RedisStore from "connect-redis";
import { redisConnection } from "./redis";

import {
  AUTH_COOKIE_SECRET,
  COOKIE_NAME,
  REDIS_COOKIE_EXPIRATION_TTL,
  SHOULD_SET_SECURE_SESSION_COOKIE,
  EXPRESS_SESSION_COOKIE_MAXAGE,
  SHOULD_TRUST_PROXY_SECURE_SESSION_COOKIE,
} from "./env";

export const sessionConfig = {
  store: new RedisStore({
    // Doc: https://github.com/tj/connect-redis
    // From doc:
    //
    // "If the session cookie has a `expires` date, `connect-redis`
    // will use it as the TTL."
    // Otherwise, it will expire the session using the `ttl` option (default:
    // 86400 seconds or one day).
    //
    // Note: The TTL is reset every time a user interacts with the server. You
    // can disable this behavior in *some* instances by using `disableTouch`.
    //
    // Note: `express-session` does not update `expires` until the end of the request life cycle. Calling `session.save()` manually beforehand will have the previous value.
    client: (async () => await redisConnection.open())(),
    // The ttl is used to create an expiration date. If you do not want to expire your cookie, check out https://stackoverflow.com/a/35127487/13156302
    // ttl: REDIS_COOKIE_EXPIRATION_TTL,
  }),
  saveUninitialized: false,
  resave: false,
  secret: AUTH_COOKIE_SECRET,
  name: COOKIE_NAME,
  proxy: SHOULD_TRUST_PROXY_SECURE_SESSION_COOKIE,
  cookie: {
    httpOnly: true,
    sameSite: true,
    maxAge: EXPRESS_SESSION_COOKIE_MAXAGE,
    secure: SHOULD_SET_SECURE_SESSION_COOKIE,
  },
};
