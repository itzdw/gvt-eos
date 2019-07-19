const routers = {
  path: "/order",
  name: "order",
  redirect: { name: "order-index" },
  component: () => import("@/components/container/ContainerRoot.vue"),
  children: [
    {
      path: "/",
      name: "order-index",
      meta: { title: "购物清单" },
      component: () => import("@/views/order")
    }
  ]
}

export default routers