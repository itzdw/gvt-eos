<template>
  <div class="CartPane">
    <cart-pane-title 
      ref="cart-pane-title"
      :warehouse-name="$attrs.warehouseName"
      @on-warehouse-checked-change="warehouseCheckedChange">
    </cart-pane-title>

    <cart-pane-item 
      ref="cart-pane-item" 
      :products="$attrs.productList"
      @on-products-checked-all-change="productsCheckedAllChange">
    </cart-pane-item>
  </div>
</template>

<script>
import CartPaneTitle from "./CartPaneTitle"
import CartPaneItem from "./CartPaneItem"
// import { updateMobileShoppingCart } from "@/api/cart";

export default {
  name: "CartPane",

  inheritAttrs: false,

  components: { CartPaneTitle, CartPaneItem },
  created() {

  },
  methods: {
    
    warehouseCheckedChange(checked) {
      // 每当仓库勾选框变化时
      // 让其下的商品勾选框全选或不全选
      this.$refs["cart-pane-item"].checkOrUnCheckAll(checked)
    },

    productsCheckedAllChange(checkedAll) {
      // 每当商品勾选变化时
      // 让其上的仓库勾选框选中或不选中
      this.$refs["cart-pane-title"].checked = checkedAll
    }
  }
}
</script>
