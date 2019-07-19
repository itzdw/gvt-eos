<template>
  <div class="HomeProductList">
    <home-product-list-item 
      v-for="item in classCodeList" 
      :code="item.classCode" 
      :name="item.className" 
      :key="item.classCode" 
      :loading="false" 
      :more-show="true"
      :pagination-size="4">
    </home-product-list-item>
  </div>
</template>
<script>
import { getHotSaleProductListByClass } from "@/api/home";
import HomeProductListItem from "@/components/product";
import { findComponentsDownward } from "@/utils/helper";
export default {
  name: "HomeProductList",
  components: {
    HomeProductListItem
  },
  props: {
    proClassList: {
      type: [Array],
      default: () => []
    },
    scrollClassCode: {
      type: [Number, String],
      default: ""
    }
  },
  data() {
    return {
      defaultImg: "/static/images/product/product.jpg",
      classCodeList: this.proClassList,
      currentClassCode: this.scrollClassCode,
      codeIndex: 0,
      switch: false,
      pagination: {
        num: 1,
        size: 2
      },
      //是否滚动到当前位置
      loadingRoll: false,
      querySelectorName: "",
      products: [],
      // 挂载完成之后，当前组件距离顶部距离
      positionX: 100
    };
  },
  watch: {
    proClassList(val) {
      this.classCodeList = val;
    },
  },
  created() {
    this.$bus.on("anchorRoll", this.anchorRoll);
  },

  beforeDestroy() {
    this.$bus.off("anchorRoll", this.anchorRoll);
    this.$bus.off("scroll", this.rollLoading);
  },

  methods: {
    anchorRoll(classCode) {
      //查询子组件集合
      const childList = findComponentsDownward(this, "homeProductListItem");
      //获取当前点击的code对应的子组件
      const targetItem = childList.filter(item => item.code === classCode);
      //手机只识别document.body.scrollTop 电脑端只识别document.documentElement.scrollTop
      document.documentElement.scrollTop = targetItem[0].offsetTop;
      document.body.scrollTop = targetItem[0].offsetTop;
    },
    // rollLoading() {
    //   this.$bus.emit("scroling")
    // },

    
  }
};
</script>
