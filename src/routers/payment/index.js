const routers = {
  path: "/payment",
  name: "payment",
  redirect: { name: "payment-confirm-order" },
  component: () => import("@/components/container/ContainerBase"),
  children: [
    {
      path: "confirm-order",
      name: "payment-confirm-order",
      meta: { title: "确认订单" },
      component: () => import("@/views/payment/confirm-order")
    },
    {
      path: "pay-order",
      name: "payment-pay-order",
      meta: { title: "确认付款" },
      component: () => import("@/views/payment/pay-order")
    }
  ]
}

export default routers