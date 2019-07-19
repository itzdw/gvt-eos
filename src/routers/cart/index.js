const routers = {
  path: "/cart",
  name: "cart",
  redirect: { name: "cart-index" },
  component: () => import("@/components/container/ContainerRoot.vue"),
  children: [
    {
      path: "/",
      name: "cart-index",
      meta: { title: "购物清单", keepAlive: true },
      component: () => import("@/views/cart")
    }
  ]
}

export default routers