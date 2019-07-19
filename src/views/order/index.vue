<template>
  <div>
    <order-tabs @on-toggle-order="toggleOrder"></order-tabs>
    <order-search @on-search-click="searchSubmit"></order-search>
    <order-list :product-data="orderList"></order-list>
    <div v-show="orderList.length === 0" class="point text-center">订单还是空的哦</div>
    <back-top></back-top>
  </div>
</template>

<script>
import OrderTabs from "./components/OrderTabs"
import OrderSearch from "./components/OrderSearch"
import OrderList from "./components/OrderList"
import { getMobilePurchaseList } from "@/api/cart"
import { Indicator, Toast } from "mint-ui"
import Auth from "@/utils/auth"
import BackTop from "@/components/backTop";
export default {
  name: "orderIndex",
  components: { OrderTabs, OrderSearch, OrderList, BackTop },
  data() {
    return {
      status: "",
      orderList: [],
      form: {
        orderNum: ""
      },
      pagination: {
        num: 1,
        total: 0,
        size: 10,
      },
      loadOff: true,
      offsetTop: "",
      loadedStatus: "init"
    }
  },
  watch: {
    status(val) {
      this.orderList = [];
      this.getMobilePurchaseList(true);
    }
  },
  mounted() {
    // 监听 scrollTop
    this.$nextTick(() => {
      window.addEventListener("scroll", this.scrollEvent);
    });
  },
  beforeDestroy() {
    this.$bus.off("scroll", this.scrollEvent);
  },
  methods: {
    scrollEvent() {
      // this.$bus.emit("rollingEvent")
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop; //变量windowHeight是可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight; //变量scrollHeight是滚动条的总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight; //滚动条到底部的条件
      if (this.pagination.num > this.pagination.total / this.pagination.num) {
        //加载完毕
        return;
      }
      if (scrollTop + windowHeight == scrollHeight && this.loadOff) {
        //写后台加载数据的函数
        if (this.loadedStatus == "init" || this.loadedStatus == "success") {
          this.pagination.num += 1;
          this.getMobilePurchaseList();
        } else if (this.loadedStatus == "failed") {
          this.getMobilePurchaseList();
        }
      }
    },
    searchSubmit(val) {
      this.form.orderNum = val;
      this.orderList = [];
      this.getMobilePurchaseList(true);
    },
    toggleOrder(val) {
      // this.orderList = [];
      this.status = val;
    },
    getMobilePurchaseList(reload = false) {
      reload && (this.pagination.num = 1)
      //单状态，为空返回所有订单状态(10 待付款 11 待发货 12待收货 13已取消 14 已完成 15待确认)
      let StoreType = Auth.getStoreType();
      let StoreId = Auth.getStoreId();
      if(StoreType && StoreId) {
        Indicator.open();
        let params ={
          status: this.status,
          num: this.pagination.num,
          size: this.pagination.size
        }; 
        if(this.form.orderNum) {
          params.orderNumList = [this.form.orderNum]
        }
        getMobilePurchaseList(params).then(response => {
          if(response.success) {
            if(response.data) {
              this.pagination.total = response.data.total;
              if (response.data.records.length === 0) {
                this.loadOff = false;
                this.loadedStatus = "success";
                Indicator.close();
              } else {
                let records = response.data.records.map(item => {
                  item._develop = false;
                    return item;
                });
                this.orderList = this.orderList.concat(records);
              }
              this.loadedStatus = "success";
            } else {
              this.pagination.total = 0;
              this.loadedStatus = "failed";
            }
            // if(response.data.records) {
            //   this.orderList = response.data.records.map(item => {
            //     item._develop = false;
            //       return item;
            //   });
            // }else {
            //   this.orderList = [];
            // }
            Indicator.close();
          }else {
            Indicator.close();
            Toast("请先选择门店");
          }
        }).catch(error => {
          Toast(error.message);
          Indicator.close();
          this.errorMessage = error.message;
        })
      }else {
        Indicator.close();
        Toast("请先选择门店！");
        return;
      }
    },
  }
};
</script>

