import Vue from "vue"
import VueRouter from "vue-router"
import homeRouters from "@/routers/home"
import cartRouters from "@/routers/cart"
import orderRouters from "@/routers/order"
import paymentRouters from "@/routers/payment"
import productRouters from "@/routers/product";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: { name: "home-index" },
  },

  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/Login")
  },

  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404")
  },

  {
    path: "/search",
    name: "search",
    component: () => import("@/views/search")
  },

  homeRouters,

  cartRouters,

  orderRouters,

  paymentRouters,

  productRouters,

  {
    path: "*",
    redirect: { name: "404" }
  }
]

export default new VueRouter({
  mode: "hash",
  scrollBehavior: () => ({ y: 0 }),
  routes
})
