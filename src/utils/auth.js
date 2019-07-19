const prefixToken = "GVT_AUTH_TOKEN";
const StoreId = 'EOS_STORE_ID';
const StoreType = 'EOS_STORE_TYPE';

class Auth {

  constructor() {}

  static setToken(token) {
    return localStorage.setItem(prefixToken, token);
  }

  static getToken() {
    return localStorage.getItem(prefixToken);
  }

  static removeToken() {
    return localStorage.removeItem(prefixToken);
  }

  static getStoreId() {
    return localStorage.getItem(StoreId);
  }

  static setStoreId(arg) {
    return localStorage.setItem(StoreId, arg)
  }

  static removeStoreId() {
    return localStorage.removeItem(StoreId);
  }
  static logOut() {
    this.removeToken();
    window.location.hash = "/login";
  }

  static getStoreType() {
    return localStorage.getItem(StoreType);
  }

  static setStoreType(arg) {
    return localStorage.setItem(StoreType, arg)
  }

  static removeStoreType() {
    return localStorage.removeItem(StoreType);
  }

}

export default Auth;
