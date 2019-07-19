<template>
  <div class="Cart">
    <cart-operate></cart-operate>
    <cart-pane 
      v-for="item in shoppingCartList" 
      :key="item.warehouseNum"
      v-bind="{ warehouseName: item.warehouseName, productList: item.details }">
    </cart-pane>
    <div v-show="shoppingCartList.length === 0" class="point text-center">购物车还是空的哦</div>
    <cart-amount
      ref="cart-amount"
      @on-check-all="checkAll"
      :payInfo="payInfo">
    </cart-amount>
  </div>
</template>

<script>
import CartPane from "./components/CartPane";
import CartAmount from "./components/CartAmount";
import CartOperate from "./components/CartOperate";
import { updateMobileShoppingCart, getShopCart } from "@/api/cart";
import { findComponentsDownward } from "@/utils/helper";
import { mapGetters } from "vuex";
import Auth from "@/utils/auth";
import { Toast } from "mint-ui";

export default {
  name: "Cart",
  components: { CartPane, CartAmount, CartOperate },

  data() {
    return {
      // 总价
      // amount: 0,
      //  shopCurrencySymbol: "",
       //总价，价格单位，“结算按钮是否可以点击”
       payInfo:{amount:0,shopCurrencySymbol:""},
      // 数据源
      shoppingCartList: [],
     
    };
  },

  computed: {},

  created() {
    this.$bus.on("warehouse-checked-changed", this.warehouseCheckedChanged);
    this.$bus.on("recalculate-amount", this.recalculateAmount);
  },

  mounted() {
    // this.data = this.cart.data
    this.initCart();
  },

  beforeDestroy() {
    this.$bus.off("warehouse-checked-changed", this.warehouseCheckedChanged);
    this.$bus.off("recalculate-amount", this.recalculateAmount);
  },

  methods: {
    initCart() {
      getShopCart()
        .then(response => {
          if (response.success) {
            for(var i=0;i<response.data.length;i++){
              for(var n=0;n<response.data[i].details.length;n++){
                response.data[i].details[n].shopCurrencySymbol=response.data[i].shopCurrencySymbol;
                response.data[i].details[n].warehouseNum=response.data[i].warehouseNum;//保存购物车的时候用到，将仓库编号放到每一个商品里边，到时候容易获取
              }
            }
            this.shoppingCartList = response.data;
            this.recalculateAmount();
            
          } else {
            Toast("请先选择门店");
            return;
          }
        })
        .catch(error => {
          Toast("请先选择门店");
          return;
        });
    },
    checkAll(checked) {
      // 操作仓库勾选状态
      const CartPaneTitles = findComponentsDownward(this, "CartPaneTitle");
      CartPaneTitles.map(component => {
        component.checked = checked;
      });
      // 操作商品勾选状态
      const CartPaneItems = findComponentsDownward(this, "CartPaneItem");
      CartPaneItems.map(component => {
        component.checkOrUnCheckAll(checked);
      });
    },

    warehouseCheckedChanged() {
      // 统计当前仓库个数
      const length = this.shoppingCartList.length;
      const CartPaneTitles = findComponentsDownward(this, "CartPaneTitle");
      // 统计当前已选中仓库个数
      const filters = CartPaneTitles.filter(
        component => component.checked === true
      );
      // 判断仓库的总数和已选数是否相同
      const flag = filters.length === length;
      // 更新 CartAmount 全选状态
      this.$refs["cart-amount"].checked = flag;
    },

    // 重新计算购物清单总价
    recalculateAmount() {
      this.payInfo.canpay=false;
      this.$nextTick(() => {
        const CartPaneItems = findComponentsDownward(this, "CartPaneItem");
        let amount = 0;
        CartPaneItems.map(component => {
          component.productList.map(item => {
            if (item._checked) {
              // TODO 若服务端 salePrice 为 String, 务必 parseFloat() 一下转为 Number
              amount += item.price * item.quantity;
              this.payInfo.shopCurrencySymbol=item.shopCurrencySymbol;//单位
            }
          });
        });
        this.amount = this.strip(amount);
       // this.payInfo:{amount:0,shopCurrencySymbol:"",canpay:false,},
        this.payInfo.amount=this.strip(amount);
        
      });
    },

    // 1.4000000000000001 => 1.4
    // 只能用于处理最后的数据结果
    strip(num, precision = 12) {
      return +parseFloat(num.toPrecision(precision));
    }
  }
};
</script>
