<template>
  <div class="ConfirmOrder">
    <div class="confirm-title">
      <span class="font-12 close-btn" @click="$router.push({name:'cart-index'})"><img src="/static/images/icon/close.svg" width="50" height="35"/></span>
      结算商品
    </div>
    <div v-show="productData.length === 0 && errorMessage" class="point text-center">{{errorMessage}}</div>     
    <div class="wrapper" v-for="(item,index) in productData" :key="index">
      <div class="title">
        <Row>
          <Col :span="12" class="font-12">单号: {{ item.orderNum }}</Col>
          <Col :span="12" class="text-right font-12">创建时间: {{ $options.filters.timeFormat(item.createTime, true) }}</Col>
        </Row>
      </div>

      <div class="content">
        <Row>
          <Col :span="8"><span class="font-12">商品总价:</span> {{ `${item.symbol}${item.totalPrice}` }}</Col>
          <Col :span="8"><span class="font-12">配送费:</span> {{`${item.symbol}${item.expPrice}`}}</Col>
          <Col :span="8"><span class="font-12">商品总数:</span> {{ item.proCount }}</Col>
        </Row>
      </div>

      <div class="content">
        <Row>
          <Col :span="12">供应商: {{ item.warehouseName }}</Col>
          <Col :span="12" class="btn-groups">
            <button class="mint-button mint-button--danger mint-button--small" 
              @click.prevent="toPayment(item,1)">
              <label class="mint-button-text">结算</label>
            </button> 
            <button class="mint-button mint-button--danger mint-button--small" 
              @click.prevent="toPayment(item,2)">
              <label class="mint-button-text">自提</label>
            </button> 
          </Col>
        </Row>
      </div>

      <div class="content">
         <Row>
          <Col :span="12">联系方式: {{ item.contactPhone }}</Col>
          <Col :span="12" class="btn-groups" @click.native="item._show = !item._show">
            <span class="show-product-list-btn" v-show="item._status == 1" @click="developProduct(item,index,2)">查看商品</span>
            <span class="show-product-list-btn" v-show="item._status == 2" @click="developProduct(item,index,1)">收起</span>
          </Col>
        </Row>
      </div>
      <div class="product-content" v-if="item._status == 2">
        <Row v-for="(product,p_index) in item.purchaseDetailList" :key="`name_${p_index}`">
          <Col :span="14" class="font-12">
            {{product.proName}}
          </Col>
          <Col :span="10" class="text-right">
            <span class="font-12">{{product.symbol}}</span>{{product.proPrice}}
            <span class="font-12">X</span> {{product.proDetailCount}}
          </Col>
        </Row>
      </div>
      
    </div>
  </div>
</template>


<script>
import { createPurchaseOrder, getMobilePurchaseList } from "@/api/cart";
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      routeQuery: this.$route.query,
      invoice: {
        visible: false,
        path: "/static/images/product/1.png"
      },
      productData: [],
      itemIdList: [],
      errorMessage: ""
    };
  },
  mounted() {
    this.itemIdList = JSON.parse(localStorage.getItem("cart_product"));
    this.initConfirmOrder();
  },
  methods: {
    toPayment(item,freight) {
      //$router.push({ name: 'payment-pay-order', query:{freightType: 1,orderNum: item.orderNum,symbol: item.symbol,} })
      this.$router.push({ 
        name: 'payment-pay-order', 
        query:{
          freightType: freight,
          orderNum: item.orderNum,
          symbol: item.symbol,
          shopCurrency: item.shopCurrency,
          warehouseNum: item.warehouseNum
        } 
      })
    },
    initConfirmOrder() {
      if (this.itemIdList.length === 0) {
        this.errorMessage = "没有可以结算的商品";
        Toast("没有可以结算的商品");
        this.$router.push({
          name: "cart-index"
        });
        return;
      }
      let list = [];
      //判断query传参是否是数组，这里考虑到页面刷新的时候 如果params.length=1 params的值就会变成字符串
      //如果是字符串就是单个值，直接放入数组里面
      if (Array.isArray(this.itemIdList)) {
        list = this.itemIdList;
      } else {
        list = [this.itemIdList];
      }
      createPurchaseOrder(list)
        .then(response => {
          if (response.success) {
            if (response.data.length != 0) {
              let orderList = response.data;
              this.getMobilePurchaseList(orderList);
            } else {
              Toast(response.message);
            }
          }
        })
        .catch(error => {
          Toast(error.message);
          this.errorMessage = error.message;
        });
    },
    developProduct(item,index,status) {
      item._status = status;
      this.productData[index] = item;
    },
    getMobilePurchaseList(list) {
      if (list.length === 0) {
        Toast("已经生成过订单了，去全部订单查看");
        this.errorMessage = "已经生成过订单了，去全部订单查看";
        return;
      }
      //单状态，为空返回所有订单状态(10 待付款 11 待发货 12待收货 13已取消 14 已完成)

      let params = {
        orderNumList: list,
        status: "",
        size: 1000
      };
      getMobilePurchaseList(params)
        .then(response => {
          if (response.success) {
            this.productData = response.data.records.map(item => {
              item._status = 1;
              return item;
            });
          }
        })
        .catch(error => {
          Toast(error.message);
          this.errorMessage = error.message;
        });
    }
  }
};
</script>

<style lang="less">
.ConfirmOrder {
  font-size: 14px;
  .wrapper {
    margin-bottom: 20px;
    padding: 0 10px;
    background-color: #fff;
    .title {
      background-color: #dce0e2;
      padding: 10px 10px;
      border-radius: 2px;
    }
    .content {
      padding: 10px;
      border-bottom: 1px solid #eaeaea;
      line-height: 27px;
      .btn-groups {
        text-align: right;
        button {
          height: 27px;
          border-radius: 0;
        }
        .show-product-list-btn {
          color: #26a2ff;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
