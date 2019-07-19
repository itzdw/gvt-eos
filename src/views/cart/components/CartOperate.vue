<template>
  <div class="CartPane">
    <div class="cart-wapper" style="line-height:30px">
      <Row>
        <Col :span="12">
          <span class="color-red font-14 margin-right-20" @click="clearCart">
            <img src="/static/images/icon/alter_delete.svg" width="20" height="20">
            清空购物车
          </span>
        </Col>
        <Col :span="12" class="text-right">
          <mt-button type="primary" size="small" class="button-save" @click="saveMobileShoppingCart">保存</mt-button>          
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { saveShopCart, removeShopCart } from "@/api/cart";
import { findComponentsDownward } from "@/utils/helper";
import Auth from "@/utils/auth";
import { Toast, MessageBox } from "mint-ui";
export default {
  name: "CartOperate",
  created() {},
  methods: {
    saveMobileShoppingCart() {
      //查询父组件
      let Cart = this.$parent;
      //查询子组件
      let CartPanes = findComponentsDownward(Cart, "CartPane");
      let detailDTOList = [];
      if (CartPanes.length) {
        CartPanes.map(item => {
          let productList = item.$refs["cart-pane-item"].productList;
          productList.map(row => {
            detailDTOList.push({
              batch: row.batch, //批次号 有效期
              gvtSku: row.gvtSku,
              itemNum: row.itemNum,
              barcode: row.barcode,
              warehouseNum: row.warehouseNum,
              quantity: row.quantity,
              saleType: row.saleType
            });
          });
        });
      }
      if (detailDTOList.length === 0) {
        Toast("没有数据可以保存");
        return;
      }
      let StoreType = Auth.getStoreType();
      let StoreId = Auth.getStoreId();
      if (StoreType && StoreId) {
        saveShopCart(detailDTOList)
          .then(response => {
            if (response.success) {
              this.$nextTick(() => {
                Toast("购物车保存成功");
              });
            } else {
              Toast(response.message);
            }
          })
          .catch(error => {
            Toast("保存数据失败," + error.message);
          });
      } else {
        Toast("请先选择门店！");
        return;
      }
    },
    clearCart() {
      //查询父组件
      let Cart = this.$parent;
      //查询子组件
      let CartPanes = findComponentsDownward(Cart, "CartPane");
      let params = [];
      if (CartPanes.length) {
        CartPanes.map(item => {
          let productList = item.$refs["cart-pane-item"].productList;
          productList.map(row => {
            params.push(row.id);
          });
        });
      }
      if (params.length === 0) {
        Toast("购物车已经是空的了哦");
        return;
      }
      MessageBox.confirm("确定要清空购物车吗")
        .then(action => {
          const Cart = this.$parent;    
          removeShopCart(params)
            .then(response => {
              if (response.success) {
                Toast("清空购物车成功");
                 Cart.initCart();
              } else {
                Toast(response.message);
              }
            })
            .catch(error => {
              Toast("清空购物车失败，" + response.message);
            });
        })
        .catch(error => {});
    }
  }
};
</script>
