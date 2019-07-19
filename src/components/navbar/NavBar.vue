<template>
  <mt-tabbar v-model="selected" fixed>
    <mt-tab-item id="home" @click.native="goTo('home')">
      <svg class="home-icon" aria-hidden="true">
        <use xlink:href="#icon-home"></use>
      </svg>
      <p class="navbar-item">首页</p>
    </mt-tab-item>
    <mt-tab-item id="cart" @click.native="goTo('cart')">
      <svg class="home-icon" aria-hidden="true">
        <use xlink:href="#icon-cart"></use>
      </svg>
      <p class="navbar-item">购物清单</p>
    </mt-tab-item>
    <mt-tab-item id="order" @click.native="goTo('order')">
      <svg class="home-icon" aria-hidden="true">
        <use xlink:href="#icon-weibiaoti-"></use>
      </svg>
      <p class="navbar-item">全部订单</p>
    </mt-tab-item>
  </mt-tabbar>
</template>

<script>
export default {
  name: "NavBar",

  data() {
    return {
      selected: "",
      menus: [
        { name: "home", label: "首页" },
        { name: "cart", label: "购物清单" },
        { name: "order", label: "全部订单" },
      ]
    }
  },

  watch: {
    $route() {
      this.selected = this.$route.matched[0]["name"]
    }
  },

  created() {
    this.selected = this.$route.matched[0]["name"]
  },

  methods: {
    goTo(name) {
      this.$router.push({ name })
    }
  }
};
</script>

<style lang="less">
.navbar-item {
  font-size: 14px;
  margin: 5px 0;
}
.mint-tab-item {
  color: #999;

}
</style>
