const routers = {
  path: "/product",
  name: "product",
  redirect: { name: "product-index" },
  component: () => import("@/components/container/ContainerRoot.vue"),
  children: [
    {
      path: "/",
      name: "product-index",
      meta: { title: "商品列表" },
      component: () => import("@/views/product")
    }
  ]
}

export default routers