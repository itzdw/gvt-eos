<template>
  <div class="HomeCategory text-center">
    <Row>
      <Col :span="4" v-for="(item,index) in categoryList" :key="item.classCode">
        <div class="item" @click="anchorRoll(item.classCode)" :style="{backgroundColor: colorList[index]}" :key="item.classCode">{{item.className}}</div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { findComponentUpward,findComponentsDownward,findBrothersComponents,findComponentDownward } from "@/utils/helper";
export default {
  name: "HomeCategory",
  props: {
    proClassList: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      categoryList: this.proClassList,
      colorList: [
        "#ffc76a",
        "#add352",
        "#fb79b7",
        "#6bbfff",
        "#fd7f4d",
        "#ff8b7f",
      ]
    }
  },
  watch: {
    proClassList(val) {
      this.categoryList = val;
    }
  },
  methods: {
    anchorRoll (classCode) {
      this.$bus.emit("anchorRoll", classCode);
      //查询父组件
      // const parentC = findComponentUpward(this, "home");
      // //查询子组件
      // const childC = findComponentDownward(parentC, "HomeProductList");
      // //查询子组件集合
      // const childList = findComponentsDownward(parentC, "homeProductListItem");
      // //获取当前点击的code对应的子组件
      // const targetItem = childList.filter(item => item.code === classCode);
      // document.documentElement.scrollTop = targetItem[0].offsetTop+350;
      // document.body.scrollTop = targetItem[0].offsetTop+350;
      // console.error(targetItem);
      // targetItem.offset
    }
  }
}
</script>

<style lang="less">
.HomeCategory {
  padding-top: 10px;
  background-color: #fff;
}
</style>


