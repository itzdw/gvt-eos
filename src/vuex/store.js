import middlewares from './middlewares'
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import permission from "./modules/permission"
import cart from "./modules/cart"
import getters from './getters'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    permission,
    cart
  },
  getters,
  strict: false,
  plugins: middlewares,
});
