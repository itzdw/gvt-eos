import axios from "axios"
import Auth from "./auth"
import { BACKEND_DOMAIN } from "./env"
import { JWT_EXPIRES_CODE } from "./constants"
import store from "@/vuex/store"

const http = axios.create({
  baseURL: BACKEND_DOMAIN,
  timeout: 10000
});

http.interceptors.request.use(config => {
  const jwt = Auth.getToken();
  const GvtStoreId = Auth.getStoreId();
  const GvtStoreType = Auth.getStoreType();
  jwt && (config.headers["Authorization"] = jwt);
  GvtStoreId && (config.headers['GvtStoreId'] = GvtStoreId);
  GvtStoreType && (config.headers['GvtStoreType'] = GvtStoreType);
  config.headers['Accept-Language'] = "zh-CN";
  return config;
}, error => {
  Promise.reject(error);
});
http.interceptors.response.use(response => {
  const code = response.data.code;

  if(JWT_EXPIRES_CODE.indexOf(code) > -1) {
    store.dispatch("Logout")
    return Promise.reject({redirect: "login", message: "登录过期"})
  }
  if(code != 200) {
    return Promise.reject(response.data);
  }
  return response.data;
}, error => {
  if(error.code === "ECONNABORTED"){
    return Promise.reject({message:"请求超时"});
  }else{
    return Promise.reject(error);
  }
});

export default http;
