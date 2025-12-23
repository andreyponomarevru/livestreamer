export const NDOE_ENV = process.env.NODE_ENV as "development" | "production";
export const BROADCASTER_USERNAME = process.env.BROADCASTER_USERNAME!;
export const BROADCASTER_PASSWORD = process.env.BROADCASTER_PASSWORD!;

export const apiConfig = {
  development: {
    API_HOST: "localhost",
    API_PORT: 5000,
    API_ROOT_PATH: "",
    API_SESSION_URL: `http://localhost:5000/api/v1/sessions`,
    API_STREAM_PATH: "/stream",
    BROADCASTER_USERNAME,
    BROADCASTER_PASSWORD,
  },
  production: {
    API_HOST: "live.andreyponomarev.ru",
    API_PORT: 443,
    API_ROOT_PATH: "/api/v1",
    API_SESSION_URL: "https://live.andreyponomarev.ru:443/api/v1/sessions",
    API_STREAM_PATH: "/stream",
    BROADCASTER_USERNAME,
    BROADCASTER_PASSWORD,
  },
};
