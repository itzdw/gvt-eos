import Vue from 'vue'
import App from '@/App.vue'
import router from "@/routers"
import MintUI from "mint-ui"
import Grid from "@/components/grid"
import Bus from "@/utils/bus"
import Auth from "@/utils/auth"
import store from "@/vuex/store"
import * as filters from './filters/'
import 'lib-flexible/flexible'

Vue.use(Bus)
Vue.use(MintUI)
Vue.use(Grid)

const accessRoutePath = ["/", "/home/", "/product/", "/login", "/403", "/404", "/500"];

router.beforeEach((to, from, next) => {
  if(Auth.getToken()) {
    if(to.name === "login" || to.path === "/") {
      next({ name: "home-index" })
    } else {
      if(store.getters.user.id === "") {
        store.dispatch("FetchUserData").then(apps => {
          store.dispatch("InitPermissionByApps", apps).then(() => {
            next()
          })
        }).catch(error => {
          Auth.removeStoreId();
          Auth.removeStoreType();
          Auth.removeToken()
          next({ path: `/${error.redirect}` })
        })
      } else {
        next()
      }
    }
  } else {
    if(accessRoutePath.indexOf(to.path) > -1) {
      next()
    } else {
      next({ path: "/login" })
    }
  }
  
})
// 注入全部过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

router.afterEach(router => {
  let title = "Astraea"
  if(router.meta.title) {
    title += `- ${router.meta.title}`
  }
  document.title = title
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
