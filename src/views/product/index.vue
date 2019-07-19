<template>
  <div class="HomeProductList">
    <home-product-list-item :code="routeQuery.code" :name="routeQuery.name" :loading="true" :pagination-size="10" :more-show="false"></home-product-list-item>
    <back-top></back-top>
  </div>
</template>
<script>
import HomeProductListItem from "@/components/product";
import BackTop from "@/components/backTop";

export default {
  components: {
    HomeProductListItem,
    BackTop
  },
  data() {
    return {
      routeQuery: this.$route.query,
      form: {
        
      }
    }
  },
  mounted() {
    // 监听 scrollTop
    this.$nextTick(() => {
      window.addEventListener("scroll", this.scrollEvent);
    });
  },
  beforeDestroy() {
    this.$bus.off("scroll", this.scrollEvent);
  },
  methods: {
    scrollEvent() {
      this.$bus.emit("rollingEvent")
    },
  }
}
</script>
