<template>
  <div class="OrderSearch">
    <Row >
      <Col :span="20" class="input-wrapper">
        <input placeholder="请输入订单号" type="tel" class="mint-field-core" v-model.trim="orderNum">
      </Col>
      <Col :span="4" class="button-wrapper" @click.native="searchClick">
        <button class="mint-button mint-button--primary mint-button--small">
          <label class="mint-button-text">搜索</label>
        </button> 
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: "OrderSearch",

  data() {
    return {
      orderNum: ""
    }
  },

  methods: {
    searchClick() {
      this.$emit("on-search-click", this.orderNum)
    }
  }
}
</script>

<style lang="less">
.OrderSearch {
  .input-wrapper {
    padding-left: 10px;
    .mint-field-core {
      box-sizing: border-box;
      border: 1px solid #26a2ff;
      padding: 0 10px;
    }
  }

  .button-wrapper {
    text-align: right;
    padding-right: 10px;
    button {
      height: 27px;
      border-radius: 0;
    }
  }
}
</style>


