<template>
  <div class="CartPaneItem">
    <Row class="pane-row" v-for="(item, index) in productList" :class="{'bggreen': item.saleType==2}" :key="item.id" type="flex" justify="center" align="middle">
      <Col :span="2">
        <check-box  style="margin-left:3px;" v-model="item._checked" @on-change="checkBoxChange"></check-box> 
      </Col>
      <Col :span="22">
        <Row type="flex" justify="center" align="middle" class="font-12">
          <Col :span="4">
            <img :src="item.imageUrl || defaultImg" :alt="item.proName" class="pic"> 
          </Col>
          <Col :span="12">
            <div class="span">
              <p>{{ item.productName }}</p> 
              <p>规格: {{ item.specification }}</p> 
              <p><span>销售价: </span><span class="color-red">{{item.shopCurrencySymbol}}{{ item.price}}</span></p> 
              <p>起订量: {{ item.minQueryLimit }}</p> 
            </div>
          </Col>
          <Col :span="8">
            <cart-pane-item-stepper v-model="item.quantity" :baseInfo.sync="item" @on-change="stepperChange(index, ...arguments) "></cart-pane-item-stepper>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
import CheckBox from "@/components/checkbox"
import CartPaneItemStepper from "./CartPaneItemStepper"
import { defaultImg } from '@/utils/base'

export default {
  name: "CartPaneItem",

  components: { CheckBox, CartPaneItemStepper },

  props: {
    products: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      productList: [],
      defaultImg: defaultImg,
    }
  },

  watch: {
    products() {
      this.updateProducts()
    }
  },

  created() {
    this.updateProducts();
    this.checkBoxChange()
  },

  methods: {
    updateProducts() {
      // TODO 处理购物清单添加场景
      // 为每一个 product item 添加 _checked 私有属性, 用于给 checkbox v-model 提供数据源
      // 并解除 props 与 this.data 的同向引用
      this.productList = this.products.map(item => {
        return Object.assign({}, item, { _checked: true })
      })
    },

    // 更新当前商品状态为 全部选中 或 全部不选中
    checkOrUnCheckAll(checked = true) {
      this.productList = this.productList.map(item => {
        return Object.assign({}, item, { _checked: checked })
      })
    },

    checkBoxChange() {
      // 检索是否扔有商品未选中
      const found = this.productList.find(item => item._checked === false);
      // 若扔有商品未选中, 则 checkedAll = false
      // 若没有商品未选中, 则 checkedAll = true
      const checkedAll = found ? false : true
      this.$emit("on-products-checked-all-change", checkedAll)
      this.broadcastRecalculateAmount()
    },

    stepperChange(index, newValue, oldValue) {
      if(this.productList[index]["_checked"]) {

        this.broadcastRecalculateAmount()

      }
    },

    // 广播"重新计算金额"
    broadcastRecalculateAmount() {
      this.$bus.emit("recalculate-amount")
    }

  }
}
</script>

<style lang="less">
.CartPaneItem {
  p {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.bggreen{
  border: 1px solid #bdd4bd;
}
</style>