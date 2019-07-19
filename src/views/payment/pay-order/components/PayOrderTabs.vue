<template>
  <ul class="PayOrderTabs" ref="PayOrderTabs">
    <li class="wrapper" v-for="item in payMethod" @click="tabClick(item)" :class="{ active: checked === item.methodCode }">
      <span class="item">{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "PayOrderTabs",
  props: {
    payMethod: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checked: undefined
    }
  },
  watch: {
    payMethod: {
      immediate: true,
      handler(val) {
        if(val.length) {
          this.$nextTick(() => {
            this.$refs["PayOrderTabs"].querySelector(".wrapper").click();
          })
        }
      }
    }
  },
  methods: {
    tabClick(item) {
      this.checked = item.methodCode;
      this.$emit("on-tabs-click", item)
    }
  }
}
</script>

<style lang="less">
.PayOrderTabs {
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
    width: 25%;
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

