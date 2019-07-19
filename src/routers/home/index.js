const routers = {
  path: "/home",
  name: "home",
  redirect: { name: "home-index" },
  component: () => import("@/components/container/ContainerRoot.vue"),
  children: [
    {
      path: "/",
      name: "home-index",
      meta: { title: "首页" },
      component: () => import("@/views/home")
    }
  ]
}

export default routers