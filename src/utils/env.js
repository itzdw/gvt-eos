const USER_LOGIN_API_URL = "/login";

const USER_INFO_API_URL = "/ums/auth/getUserRelateData";

const APP_CODE_LIST = ["gvt-eos-mobile-frontend"];

const WEBPACK_DEV_SERVER_PORT = 9092;

// const WEBPACK_DEV_SERVER_PROXY_TARGET = "http://localhost:8642/";
const WEBPACK_DEV_SERVER_PROXY_TARGET = "http://192.168.1.116/eosv6/";
// const WEBPACK_DEV_SERVER_PROXY_TARGET = "http://192.168.1.111:8642/";

let backend;
switch (process.env.NODE_ENV) {
  // 测试环境
  case "fat":
    backend = "http://192.168.1.116/eosv6/";
    break;
  // 开发环境
  case "dev":
    backend = "http://192.168.1.35/eosv6/";
    break;
  // 生产环境
  case "production":
    backend = "http://router.astraea.com.au/eos/";
    break;
  // 本地开发
  default:
    backend = "/api";
}

const FRONTEND_DOMAIN = `http://localhost:${WEBPACK_DEV_SERVER_PORT}/#`;

const BACKEND_DOMAIN = backend;

const ENV = process.env.NODE_ENV;

module.exports = {
  USER_LOGIN_API_URL,
  USER_INFO_API_URL,
  APP_CODE_LIST,
  FRONTEND_DOMAIN,
  BACKEND_DOMAIN,
  WEBPACK_DEV_SERVER_PORT,
  WEBPACK_DEV_SERVER_PROXY_TARGET,
  ENV
}
