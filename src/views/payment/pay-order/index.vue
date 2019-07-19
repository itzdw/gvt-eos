<template>
  <div class="PayOrder">
    <div class="confirm-title">
      <span class="font-12 close-btn" @click="$router.push({name:'order-index'})"><img src="/static/images/icon/close.svg" width="50" height="35"/></span>
      付款
    </div>
    <mt-field label="订单编号:" :value="payInfo.orderNum" readonly disableClear></mt-field>
    <mt-field label="收款单位:" :value="payInfo.warehouseName" readonly disableClear></mt-field>
    <mt-field label="商品金额:" :value="`${routeQuery.symbol}${payInfo.productPrice}`" readonly disableClear></mt-field>
    <mt-field label="物流金额:" :value="`${routeQuery.symbol}${payInfo.expPrice}`" readonly disableClear></mt-field>
    <mt-field label="总计:" :value="`${routeQuery.symbol}${payInfo.totalPrice}`" readonly disableClear></mt-field>
    <mt-cell title="发票" label="点击查看发票" is-link @click.native="invoiceImg"></mt-cell>

    <pay-order-tabs ref="pay-order-tabs" :pay-method="payMethodList" @on-tabs-click="payOrderTabClick"></pay-order-tabs>

    <div v-show="payType.methodCode == 10901" class="margin-bottom-20">
      <img v-show="qrcode.status === 'success'" style="display:block; width: 160px; height: auto;margin:10px auto 0;" :src="qrcode.src" alt="付款二维码" />
      <div style="text-align:center;margin-bottom:10px" v-show="qrcode.status === 'fail'">
        <p>{{ qrcode.remark }}</p>
        <button @click.prevent="fetchPayQrcode" class="mint-button mint-button--warning mint-button--small">
          <label class="mint-button-text">重新获取</label>
        </button> 
      </div>
      <div style="text-align:center;" v-show="qrcode.status === 'error'">
        <p>{{ qrcode.remark }}</p>
      </div>
      <div v-show="qrcode.status === 'loading'">
        <p style="text-align:center;">正在获取支付二维码...</p>
      </div>

      <mt-cell label="请截图保存二维码图片，识别二维码图片付款" is-link></mt-cell>
    </div>

    <div v-show="payType.methodCode == 10902" class="margin-bottom-20">
      <mt-field label="BANK:" 
        v-model="transferPayInfo.bank"
        placeholder="请选择 BANK" 
        :attr="{autocomplete:false}" 
        @click.native="selection.visible = !selection.visible" 
        readonly 
        disableClear>
      </mt-field>
     <mt-field label="Acc Name:" v-model="transferPayInfo.accName" readonly disableClear></mt-field>
     <mt-field label="BSB:" v-model="transferPayInfo.bsb"readonly disableClear></mt-field>
     <mt-field label="Acc No:" v-model="transferPayInfo.accNumber" readonly disableClear></mt-field>
     <mt-field label="流水单号:" v-model="payInfo.transferNum" placeholder="请输入 流水单号"></mt-field>
     <div class="upload">
       <span class="span">转账截图:</span>
       <div class="uploadBtn">
         <button @click.prevent="fileClick" class="mint-button mint-button--primary mint-button--small" v-show="!uploader.uploadList.url">
            <label class="mint-button-text">点击上传</label>
          </button> 
          <button @click.prevent="deleteClick" class="mint-button mint-button--danger mint-button--small" v-show="uploader.uploadList.url">
            <label class="mint-button-text">删除</label>
          </button> 
       </div>
       <div class="pic" v-if="uploader.uploadList.url">
         <img :src="uploader.uploadList.url"/>  
       </div>
     </div>
     <mt-cell title="立即付款" label="请填写表单, 确认无误后点击付款" is-link @click.native="transferPay"></mt-cell>
      <input ref="files" type="file" multiple style="display:none;" @change="fileChange" accept="image/jpg, image/jpeg, image/png"/>
    </div>
    <div v-show="payType.methodCode == 10903" class="margin-bottom-20">
      <img style="display:block; width: 100px; height: auto;margin:10px auto;" :src="creditImg" />         
      <p style="text-align: center;font-size: 16px;">暂不付款,打个白条吧</p>

      <mt-cell title="立即付款" label="请确认无误后点击付款" is-link @click.native="confirmPay_credit"></mt-cell>
    </div>
    <div v-show="payType.methodCode == 10904" class="margin-bottom-20">
      <p class="text-center font-16">
        supay余额: <span class="text-red">{{routeQuery.symbol}} {{WalletBalance || 0}}</span>
      </p>
      <mt-cell title="立即付款" label="请确认无误后点击付款" is-link @click.native="confirmPay_wallet"></mt-cell>
    </div>
    <mt-popup
      v-model="invoice.visible"
      popup-transition="popup-fade"
      position="right"
      class="invoice-popup"
    >
      <img :src="invoice.path" alt="查看发票" v-show="invoice.path">
      <div class="text-center" v-show="!invoice.path" style="padding-top:100px">还没有发票哦</div>
      <mt-button
        style="position: fixed; bottom:0;border-radius: 0;"
        type="primary"
        size="large"
        @click="invoice.visible = !invoice.visible"
      >返回</mt-button>
    </mt-popup>
    <div class="bankSelection">
      <mt-actionsheet
        :actions="selection.bankSelection"
        v-model="selection.visible">
      </mt-actionsheet>
    </div>
    <div v-show="whetherPay" class="whetherPay">
      <span class="span">正在支付中...</span>
    </div>
  </div>
</template>

<script>
import PayOrderTabs from "./components/PayOrderTabs";
import {
  getMobilePurchasePayment,
  transferPay, 
  getPaymentBankInfo, 
  walletBalance,
  getSupayPaymentQRCode,
  getSupayPayResult,
} from "@/api/payment"
import { Toast } from "mint-ui"
import Auth from "@/utils/auth"

export default {
  components: { PayOrderTabs },
  data() {
    return {
      routeQuery: this.$route.query,
      WalletBalance: null,
      creditImg: "/static/images/product.jpg",
      payData: {},
      payInfo: "",
      payMethodList: [],
      transferPayInfo: {},
      SupayPayLoading: false,
      qrcode: {
        src: "",
        status: "loading",
        result: "NOT BEGIN"
      },
      selection: {
        visible: false,
        bankSlection: [],
      },
      whetherPay: false,
      invoice: {
        visible: false,
        path: ""
      },
      payType: {},
      uploader: {
        preview: {
          show: false,
          img: {}
        },
        progress: {
          status: "finished",
          percentage: 0
        },
        uploadList: {}
      },
    }
  },
  mounted() {
    this.initPayment();
  },
  methods: {
    initPayment () {
      let params = {
        freightType: this.routeQuery.freightType,
        orderNum: this.routeQuery.orderNum
      }
      getMobilePurchasePayment( params ).then(response => {
        if(response.success) {
          this.payInfo = response.data;
          this.payMethodList = response.data.paymentMethodVOList;
        }
      }).catch(error => {
        Toast(error.message);
      });
    },
    getWalletBalance() {
      let params = {
        currencyId: this.routeQuery.shopCurrency,
        shopNum: Auth.getStoreId()
      }
      walletBalance(params).then(response => {
        if(response.success) {
          this.WalletBalance = response.data.balance;
        }
      }).catch(error => {
        Toast(error.message);
      });
    },
    getPaymentBankInfo() {
      let paymentMethodId  = this.payType.methodId;
      getPaymentBankInfo(paymentMethodId).then(response => {
        if(response.success) {
          this.selection.bankSelection =  response.data.map(item => {
            item.name = item.bank;
            item.method = this.selectionChange;
            return item;
          })
        }
      }).catch(error => {
        Toast(error.message);
      });
    },
    payOrderTabClick(params) {
      this.payType = params;
      if(this.payType.methodCode == 10902) {
        this.getPaymentBankInfo();
      }
      if (this.payType.methodCode == 10904) {
        this.getWalletBalance();
      }
      if (this.payType.methodCode == 10901) {
        this.fetchPayQrcode();
      }
    },
    // 获取supay二维码
    fetchPayQrcode() {
      this.qrcode.status = "loading";
      this.qrcode.result = "NOT BEGIN";
      if (this.payMethodList.length) {
        let found = this.payMethodList.find(item => {
          return item.methodCode == 10901;
        });
        this.SupayPayLoading = true;
        if (found) {
          let params = {
            freightType: this.routeQuery.freightType,
            orderNumList: [this.payInfo.orderNum],
            warehouseNum: this.routeQuery.warehouseNum
          };
          getSupayPaymentQRCode(params)
            .then(response => {
              if (response.success) {
                this.qrcode.src = response.data.qrImageUrl; //二维码图片
                this.qrcode.status = "success";
                if (this.qrcode.result === "NOT BEGIN") {
                  this.checkPaymentDone(response.data.tradeNo);
                }
              }
            })
            .catch(error => {
              this.qrcode.status = "fail";
              this.qrcode.remark = "获取支付二维码失败,请点击下方按钮重新获取";
              this.getSupayPaymentQRCode(params);
            });
        }
      }
    },
    checkPaymentDone(tradeNo) {
      if(!this.SupayPayLoading) {
        return;
      }
      // 模态框关闭状态终止请求
      getSupayPayResult({ tradeNo })
        .then(response => {
          // 继续请求标识
          let next = false;
          // code 不为 200, 终止请求
          const code = response.code;
          if (code == 200) {
            // data 为 FALSE 继续请求, data 为 TRUE 终止请求
            if (response.data) {
              next = false;
              this.$Message.success("支付成功");
              this.$router.push({name:'order-index'});
              this.SupayPayLoading = false;
            } else {
              next = true;
            }
          } else {
            this.$Message.error(response.message);
            next = false;
          }
          if (next) {
            this.checkPaymentDone(tradeNo);
          }
        })
        .catch(error => {
          this.$Message.error(error.message);
          this.SupayPayLoading = false;
        });
    },
    selectionChange(e) {
      this.transferPayInfo = e;
    },
    invoiceImg() {
      this.invoice.path = this.payInfo.invoiceUrl!=null?this.payInfo.invoiceUrl.split(",")[0]:"";
      this.invoice.visible = !this.invoice.visible;
    },
    confirmPay_wallet() {
      // 钱包支付
      if(this.WalletBalance < this.payInfo.totalPrice ) {
        Toast('supay余额不足');
        return;
      }
      let formData = new FormData();

      this.whetherPay = true;
      formData.append("shopNum", Auth.getStoreId());
      formData.append("orderNum",  this.payInfo.orderNum);
      formData.append("warehouseNum", this.routeQuery.warehouseNum);
      formData.append("payType", this.payType.methodCode);
      formData.append("freightType", this.routeQuery.freightType);
      transferPay(formData)
        .then(response => {
          if (response.data) {
            Toast("支付成功");
            this.$router.push({name:'order-index'});
          } else {
            Toast("支付失败");
          }
          this.whetherPay = false;
        })
        .catch(error => {
          Toast(error.message);
          this.whetherPay = false;
        });
    },
    confirmPay_credit() {
      // 记账支付
      let formData = new FormData();
      this.whetherPay = true;
      formData.append("orderNum", this.payInfo.orderNum);
      formData.append("warehouseNum", this.routeQuery.warehouseNum);
      formData.append("payType", this.payType.methodCode);
      formData.append("freightType", this.routeQuery.freightType);
      transferPay(formData)
        .then(response => {
          if (response.data) {
            Toast("支付成功");
            this.$router.push({name:'order-index'});
          } else {
            Toast("支付失败");
          }
          this.whetherPay = false;
        })
        .catch(error => {
          Toast(error.message);
          this.whetherPay = false;
        });
    },
    transferPay() {
      // 转账支付
      if(!this.transferPayInfo.id) {
        Toast("请选择BANK");
        return;
      }
      if(!this.payInfo.transferNum) {
        Toast("请输入流水单号");
        return;
      }
      if(!this.uploader.uploadList.url) {
        Toast("请上传转账截图");
        return;
      }
      this.whetherPay = true;
      let formData = new FormData();
      formData.append("bankInfoId", this.transferPayInfo.id);
      formData.append("freightType", this.routeQuery.freightType);
      formData.append("imageFile", this.uploader.uploadList.url);
      formData.append("orderNum", this.payInfo.orderNum);
      formData.append("transferNum", this.payInfo.transferNum);
      formData.append("payType", this.payType.methodCode);
      transferPay(formData).then(response => {
        if(response.data) {
          Toast("支付成功");
          this.$router.push({name:'order-index'});
          this.whetherPay = false;
        }else {
          Toast("支付失败");
          this.whetherPay = false;
        }
      }).catch(error => {
        Toast(error.message);
        this.whetherPay = false;
      });
    },
    fileClick() {
      this.$refs["files"].click();
    },
    deleteClick() {
      this.uploader.uploadList = Object.assign({});
      this.$refs["files"].value="";
    },
    fileChange() {
      let vm = this;
      let i = 0,
        files = vm.$refs["files"].files,
        len = files.length,
        notSupport = false;
        if (!notSupport) {
          (function(i) {
            new html5ImgCompress(files[i], {
              before: function(file) {
                vm.uploader.progress.status = "start";
                vm.uploader.progress.percentage = 20;
              },
              done: function(file, base64) {
                vm.uploader.progress.percentage = 80;
                setTimeout(function() {
                  vm.uploader.progress.percentage = 100;
                  vm.uploader.progress.status = "finished";
                  vm.uploader.uploadList={
                    name: file.name,
                    url: base64
                  };
                  // 释放缓存 :)
                  file = null;
                }, 500);
              },
              fail: function(file) {},
              complete: function(file) {
                vm.uploader.progress.percentage = 50;
              },
              notSupport: function(file) {
                notSupport = true;
                vm.uploader.progress.percentage = 100;
                vm.uploader.progress.status = "finished";
                Toast("当前浏览器不支持上传");
              }
            });
          })(i);
        }
    },
  },
  beforeDestroy(){
    this.SupayPayLoading = false;
  }
};
</script>

<style lang="less">
.bankSelection .mint-actionsheet{
  max-height: 192px;
  overflow: auto;
}
.PayOrder {
  background-color: #fff;
  .span{
    display: inline-block;
    width: 100px;
  }
  .upload {
    background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
    background-size: 120% 1px;
    background-repeat: no-repeat;
    background-position: top left;
    background-origin: content-box;
    -webkit-box-align: center;
    height: 120px;
    padding: 0 10px;
    line-height: 100px;
    .pic{
      margin: 9px 0;
      width: 100px;
      height: 100px;
      display: inline-block;
      border: 1px solid #d6d2d2;
      border-radius: 3px;
      overflow: hidden;
      vertical-align: middle;
      float: right;
      text-align: center;
      img{
        max-width: 100%;
        max-height: 100%;
      }
      &:after{
        clear: both;
      }
    }
    .uploadBtn {
      width: 96px;
      display: inline-block;
      .mint-cell-wrapper, .mint-cell:last-child {
        background: none;
        padding-left: 0;
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
  }

}
</style>


