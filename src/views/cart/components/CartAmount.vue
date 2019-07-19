<template>
  <div class="CartAmount">
    <Row class="rowpadding">
      <Col :span="6">
        <check-box :value="checked" @click.prevent.native="checkAll">全选</check-box> 
      </Col>
      <Col :span="4">
          <mt-button type="danger" size="small" class="button-delete" @click="deleteShopping">删除</mt-button>
      </Col>
      <Col :span="14">
        <div style="text-align:right;font-size:14px;">
          合计: <span class="color-red">{{payInfo.shopCurrencySymbol}}{{ payInfo.amount }}</span>
          <mt-button type="danger" size="small" @click="payment">结算</mt-button>
        </div> 
      </Col>
    </Row>
  </div>
</template>

<script>
import CheckBox from "@/components/checkbox";
import { removeShopCart } from "@/api/cart";
import { findComponentsDownward } from "@/utils/helper";
import { Toast, MessageBox } from "mint-ui";

export default {
  name: "CartAmount",

  components: { CheckBox },

  props: {
    payInfo: {
      type: Object,
      default: () => {}
    }
    // amount: {
    //   type: [Number],
    //   default: 0
    // },
    // shopCurrencySymbol: {
    //   type: String,
    //   default: ''
    // }
  },

  data() {
    return {
      checked: false
    };
  },
  created() {
    localStorage.removeItem("cart_product");
  },
  methods: {
    checkAll() {
      this.checked = !this.checked;
      this.$emit("on-check-all", this.checked);
    },
    deleteShopping() {
      let params = this.getCheckedItemIdList();
      let _self=this;
      if (params.length === 0) {
        Toast("请先选择要删除的商品");
        return;
      }
      let ids = params.map(item => {
        return item.id;
      });
      MessageBox.confirm("确定要要删除选中商品吗")
        .then(action => {
          const Cart = this.$parent;
          removeShopCart(ids)
            .then(response => {
              if (response.success) {
                Toast("删除购物车商品成功");
                Cart.initCart();
              } else {
                Toast(response.message);
              }
            })
            .catch(error => {
              Toast("删除购物车商品失败" + error.message);
            });
        })
        .catch(error => {});
    },
    getCheckedItemIdList() {
      //查询父组件
      const Cart = this.$parent;
      //查询子组件
      let CartPanes = findComponentsDownward(Cart, "CartPane");
      let params = [];
      if (CartPanes.length) {
        CartPanes.map(item => {
          let productList = item.$refs["cart-pane-item"].productList;
          productList.map(row => {
            if (row._checked) {
              params.push({
                barcode: row.barcode,
                batch:row.batch,
                gvtSku: row.gvtSku,
                id: row.id,
                saleType: row.saleType,
                itemNum: row.itemNum,
                quantity: row.quantity,
                warehouseNum: row.warehouseNum
              });
            }
          });
        });
      }
      return params;
    },
    payment() {
      //查询父组件
      const Cart = this.$parent;
      //查询子组件
      let params = this.getCheckedItemIdList();
      //查询子组件
      let CartPanes = findComponentsDownward(Cart, "CartOperate");
      if (params.length === 0) {
        Toast("请选择要结算的商品");
        return;
      }
      if (CartPanes) {
        // 结算之前先保存购物车
        CartPanes[0].saveMobileShoppingCart();
      }
      localStorage.setItem("cart_product", JSON.stringify(params));

      setTimeout(() => {
        this.$router.push({
          name: "payment",
          query: {
            // params: params
          }
        });
      }, 300);
    }
  }
};
</script>

<style scoped lang="less">
.CartAmount {
  position: fixed;
  bottom: 56px;
  height: 40px;
  line-height: 34px;
  width: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
  .rowpadding {
    padding: 5px;
  }
  .mint-checklist-label {
    padding: 0px;
    font-size: 12px;
  }
  .button-delete {
    font-size: 12px;
  }
}
</style>


