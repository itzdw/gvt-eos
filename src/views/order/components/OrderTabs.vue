<template>
  <ul class="OrderTabs" ref="OrderTabs">
    <li class="wrapper" v-for="item in types" @click="tabClick(item)" :class="{ active: checked === item.value }">
      <span class="item">{{ item.label }}</span>
    </li>
  </ul>
</template>

<script>
import { findComponentUpward,findComponentsDownward,findBrothersComponents,findComponentDownward, debounce } from "@/utils/helper";

export default {
  name: "OrderTabs",

  data() {
    return {
      types: [
        { value: null, label: "全部" },
        { value: 10, label: "待付款" },
        { value: 11, label: "待发货" },
        { value: 12, label: "待收货" },
        { value: 14, label: "已完成" },
      ],
      checked: undefined
    }
  },
  mounted(){
    this.$refs["OrderTabs"].querySelector(".wrapper").click();
  },
  methods: {
    //10 待付款 11 待发货 12待收货 13已取消 14 已完成 15待确认
    tabClick: debounce(function(item) {
      this.doClick(item)
    }),

    doClick(item) {
      // 切换的时候清空查询文本框
      //查询父组件
      const parentC = findComponentUpward(this, "orderIndex");
      //查询子组件
      const childC = findComponentDownward(parentC, "OrderSearch");
      // 切换的时候清空查询文本框
      childC.orderNum = "";
      parentC.form.orderNum = "";
      // parentC.searchSubmit('');

      this.checked = item.value;
      this.$emit("on-toggle-order", item.value);
    }
  }

}
</script>

<style lang="less">
.OrderTabs {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
  &:after {
    display: block;
    content: "";
    clear: both;
  }
  .wrapper {
    box-sizing: border-box;
    float: left;
    width: 20%;
    text-align: center;
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
    .item {
      display: block;
      border: 1px dashed #26a2ff;
      padding: 5px 0;
    }
    &.active {
      .item {
        background-color: #26a2ff;
        color: #fff;
        font-weight: bold;
      }
    }
  }
}
</style>

