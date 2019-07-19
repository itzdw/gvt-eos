<template>
  <div class="OrderList">
    <div class="wrapper" v-for="(item,index) in productData">

      <div class="title">
        <Row>
          <Col :span="12">单号: {{ item.orderNum }}</Col>
          <Col :span="12" class="text-right">订单状态: 
            <span class="color-red" v-if="item.orderStatus == 11001">待确认</span>
            <span class="color-green" v-if="item.orderStatus == 11002">待付款</span>
            <span class="color-green" v-if="item.orderStatus == 11003">已付款</span>
            <span class="color-red" v-if="item.orderStatus == 11004">待发货</span>
            <span class="color-green" v-if="item.orderStatus == 11005">待收货</span>
            <span class="color-red" v-if="item.orderStatus == 11006">已完成</span>
            <span class="color-red" v-if="item.orderStatus == 11007">已取消</span>
          </Col>
        </Row>
      </div>
      <div class="content font-13">
        <Row>
          <Col :span="14">创建时间: <span> {{ $options.filters.timeFormat(item.createTime,true) }}</span></Col>
          <Col :span="10" class="text-right">商品总数: <span>{{ item.proCount }}</span></Col>
        </Row>
      </div>
      <div class="content font-13">
        <Row>
          <Col :span="14">商品总价: <span class="font-13">{{ `${item.symbol}${item.totalPrice}` }}</span></Col>
          <Col :span="10" class="text-right">配送费: <span>{{ `${item.symbol}${item.expPrice}` }}</span></Col>
        </Row>
      </div>
      <div class="content font-13">
        <Row>
          <Col :span="10">供应商: <span>{{ item.warehouseName }}</span></Col>
          <Col :span="14" class="btn-groups">
            <button class="mint-button mint-button--danger mint-button--small" 
              v-show="item.orderStatus == 11001 || item.orderStatus == 11002" 
              @click.prevent="toPayment(item,1)">
              <label class="mint-button-text">结算</label>
            </button> 
            <button class="mint-button mint-button--danger mint-button--small" 
              v-show="item.orderStatus == 11001 || item.orderStatus == 11002" 
              @click.prevent="toPayment(item,2)">
              <label class="mint-button-text">自提</label>
            </button> 
            <button 
              class="mint-button mint-button--primary mint-button--small" 
              v-show="item.orderStatus != 11007"
              :loading="invoiceLoading" 
              @click="generatePuachseInvoice(item)">
              <!-- @click="invoiceImg(item.invoiceImageUrl)" -->
              <label class="mint-button-text">生成发票</label>
            </button> 
            <!-- <button 
              :loading="confirmLoading" 
              @click="confirmTake(item)" 
              v-show="item.orderStatus == 11005" 
              class="mint-button mint-button--primary mint-button--small">
              <label class="mint-button-text">确认收货</label>
            </button>  -->
          </Col>
        </Row>
      </div>

      <div class="content font-13">
         <Row>
          <Col :span="14">联系方式: <span class="font-13">{{ item.contactPhone }}</span></Col>
          <Col :span="10" class="btn-groups">
            <span class="show-product-list-btn" v-show="!item._develop" @click="developProduct(item,index,true)">查看商品</span>
            <span class="show-product-list-btn" v-show="item._develop" @click="developProduct(item,index,false)">收起</span>
          </Col>
        </Row>
      </div>
      <div class="product-content" v-show="item._develop">
        <Row v-for="(product,index) in item.purchaseDetailList" :key="`name_${index}`">
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
    <mt-popup v-model="invoicePreview" popup-transition="popup-fade" position="right" class="invoice-popup">
      <img v-for="(url,index) in invoice.invoiceImageUrl" :key="`img_${index}`" :src="url" v-show="url" alt="查看发票"/>
      <div class="text-center" v-show="invoice.invoiceImageUrl.length==0" style="padding-top:100px">还没有发票哦</div>
      <mt-button class="button" type="primary" size="large" @click="togglePrview">返回</mt-button>
    </mt-popup>
  </div>
</template>

<script>
import { getMobilePurchaseList,generatePuachseInvoice } from "@/api/cart"
import { confirmPilingStock } from "@/api/payment"
import { Toast, Popup, Indicator, MessageBox } from "mint-ui";

export default {
  props: {
    productData: {
      type: Array,
      default: () => []
    }
  },
  name: "OrderList",

  data() {
    return {
      // 采购单状态：
      // 10待确认,11待付款 12已付款,13待发货,14待收货,15已完成, 16已取消
      orderList: this.productData,
      invoiceLoading: false,
      invoicePreview: false,
      invoice: {
        invoiceImageUrl: []
      },
      confirmLoading: false,
      // productData: [],
    }
  },
  methods: {
    toPayment(item,freight) {
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
    developProduct(item,index,show) {
      item._develop = show;
      this.productData[index] = item;
    },
    generatePuachseInvoice(item) {
      Indicator.open();
      this.invoiceLoading = true;
      let params = {
        orderNum: item.orderNum
      };
      generatePuachseInvoice(params).then(response => {
        if(response.success) {
          let fileNames = [];
          response.data.invoiceImgPath.split("#").map(url => {
            if(url) {
              fileNames.push(url);
            }
          });
          this.invoice.invoiceImageUrl = fileNames;
          this.invoicePreview = true;
          // this.stop();
        }
        this.invoiceLoading = false;
        Indicator.close();
      }).catch(error => {
        Toast(error.message);
        this.invoiceLoading = false;
        Indicator.close();
      });
    },
    togglePrview() {
      this.invoicePreview = false;
      // this.move();
    },
    confirmTake(item) {
      //确认收货
      let msg = `<div style="text-align:left">请确认单号：</div>${item.orderNum}是否已到货？`
      MessageBox.confirm(msg).then(action => {
        this.confirmLoading = true;
        let params = [{
          pilingStockNum: item.orderNum
        }]
        confirmPilingStock(params).then(response => {
          if(response.data) {
            
          }
          this.confirmLoading = false;
        })
      });

    },
     /***滑动限制***/
    stop(){
      var mo=function(e){e.preventDefault();};
      document.body.style.overflow='hidden';
      document.addEventListener("touchmove",mo,false);//禁止页面滑动
    },
    /***取消滑动限制***/
    move(){
      var mo=function(e){e.preventDefault();};
      document.body.style.overflow='';//出现滚动条
      document.removeEventListener("touchmove",mo,false);
    }
  },
}
</script>

<style lang="less">
.OrderList {
  font-size: 14px;
  margin-top: 20px;
  .wrapper {
    margin-bottom: 20px;
    padding: 0 10px;
    background-color: #fff;
    .title {
      background-color: #dce0e2;
      padding: 10px;
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

  .invoice-popup {
    width: 100%;
    height: 100%;
    background-color: #fff;
    img {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 30px auto 0 auto;
    }
    .button {
      position: fixed;
      bottom: 0;
      left: 0;
      border-radius: 0;
    }
  }
}
</style>


