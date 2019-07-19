<template>
  <div>
    <div :class="`product-list-item product-list-item_${attrs.classCode}`">
      <div class="category" v-show="!keyword">
        <img class="icon-pic" src="/static/images/product/nwap-bg.png" :alt="attrs.className"/>  
        {{ attrs.className }}
        <span class="more" v-show="moreShow" @click="loadMore">more ></span>
      </div>
      <div class="text-center font-12 margin-top-10" v-if="prductList.length==0 && loadedStatus==='success'">没有更多数据了</div>
      <div class="text-center font-12 margin-top-10" v-show="['init', 'loading'].indexOf(loadedStatus) > -1">正在加载中</div>
      <div class="text-center font-12 margin-top-10" v-show="loadedStatus === 'failed'">
        <mt-button type="default" size="small" @click.native="freshen" class="fresh-btn">重新加载</mt-button>
      </div>
      <Row class="product product-wrapper">
        <Col class="item-wrapper" :span="12" v-for="(row,index) in prductList" :key="`${row.itemNum}_${index}`">
          <div class="item">
            <div class="pic">
              <img class="image" :src="row.imageUrl || defaultImg " :alt="row.name"/>   
            </div>
            <div class="info">
              <Row>
                <Col :span="10" class="stock">
                  <p>库存: {{row.quantity}}</p>
                </Col>
                <Col :span="14" class="sale">
                  <p>销售价: {{`${row.symbol}${row.price}`}}</p>
                </Col>
              </Row>
              <p style="height:16px">{{ row.name }}</p>
              <p>供应商: {{row.warehouseName}}</p>
              <Row>
                <Col :span="20">
                  <p>规格: {{row.specification}}</p>
                </Col>
                <Col :span="4">
                  <!-- <button class="defaultimg" :disabled="true" ></button> -->
                  <img v-show="row.quantity!=0" src="static/images/icon/cart.svg" alt="" @click="addMobileShoppingCartEvent(row)" style="width:16px;">
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import { getHotSaleProductListByClass,searchHotSaleProductByKeyword } from "@/api/home";
import { addMobileShoppingCart } from "@/api/cart";
import { Indicator, Toast } from "mint-ui";
import Auth from "@/utils/auth";
import { defaultImg, concatArray } from "@/utils/base";
import mixin from "@/mixins";
export default {
  mixins: [mixin],
  name: "homeProductListItem",
  props: {
    code: {
      type: [String, Number],
      required: true,
      default: ""
    },
    name: {
      type: [String],
      required: true,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    moreShow: {
      type: Boolean,
      default: true
    },
    paginationSize: {
      type: [String, Number],
      default: 4
    }
  },
  data() {
    return {
      cartLoading: false,
      defaultImg: defaultImg,
      prductList: [],
      keyword: this.$route.query.keyword,
      attrs: {
        classCode: this.code,
        className: this.name
      },
      pagination: {
        num: 1,
        size: this.paginationSize,
        total: 0
      },
      loadOff: true,
      offsetTop: "",
      loadedStatus: "init"
    };
  },
  watch: {
    classCode(val) {
      this.attrs.classCode = val;
    },
    className(val) {
      this.attrs.className = val;
    },
    $route(){
      this.keyword = this.$route.query.keyword;
    },
    keyword(val) {
      if(val) {
        this.prductList = [];
        this.initData();
      }
    }
  },
  created() {
    if (this.loading) {
      this.$bus.on("rollingEvent", this.rollingEvent);
    }
    if (!this.keyword && this.attrs.classCode) {
      //通过分类加载
      this.loadData();
    } else if (this.keyword) {
      this.initData();
    }
  },

  methods: {
    loadData() {
      this.loadedStatus = "loading";
      let params = Object.assign(this.pagination, {
        classCode: this.attrs.classCode
      });
      getHotSaleProductListByClass(params)
        .then(response => {
          if (response.success) {
            this.pagination.total = response.data.total;
            if (response.data.records.length === 0) {
              this.loadOff = false;
              this.loadedStatus = "success";
              this.getOffsetTop();
              return;
            } else {
              this.prductList = this.prductList.concat(response.data.records);
              this.getOffsetTop();
            }
            this.loadedStatus = "success";
          } else {
            this.loadedStatus = "failed";
          }
        })
        .catch(error => {
          this.loadedStatus = "failed";
        });
    },
    initData() {
      this.loadedStatus = "loading";
      let params = Object.assign(this.pagination, {
        keyword: this.keyword
      });
      searchHotSaleProductByKeyword(params)
        .then(response => {
          if (response.success) {
            this.pagination.total = response.data.total;
            if (response.data.records.length === 0) {
              this.loadOff = false;
              this.loadedStatus = "success";
              return;
            } else {
              this.prductList = this.prductList.concat(response.data.records);
            }
            this.loadedStatus = "success";
          } else {
            this.loadedStatus = "failed";
          }
        })
        .catch(error => {
          this.loadedStatus = "failed";
        });
    },
    getOffsetTop() {
      // 计算到 offsetTop
      this.offsetTop = document.querySelector(
        `.product-list-item_${this.attrs.classCode}`
      ).offsetTop;
    },
    loadMore() {
      this.$router.push({
        name: "product-index",
        query: {
          code: this.attrs.classCode,
          name: this.attrs.className
        }
      });
    },
    rollingEvent() {
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
          if (!this.keyword && this.attrs.classCode) {
            this.loadData();
          }else if(this.keyword) {
            this.initData();
          }
        } else if (this.loadedStatus == "failed") {
          //报错了不需要重新加页码 重新加载这一页
          if (!this.keyword && this.attrs.classCode) {
            this.loadData();
          }else if(this.keyword) {
            this.initData();
          }
        }
      }
    },
    freshen() {
      if (!this.keyword && this.attrs.classCode) {
        this.loadData();
      }else if(this.keyword) {
        this.initData();
      }
    },
    //加入购物车
    addMobileShoppingCartEvent(row) {
      //如果没有登录就跳转到login
      if (!this.loginStatus) {
        this.redirectLogin();
        return;
      }
      let data = [
        {
          batch: row.batch, //批次号 有效期
          gvtSku: row.gvtSku,
          itemNum: row.itemNum,
          barcode: row.barcode,
          warehouseNum: row.warehouseNum,
          quantity: 1,
          saleType: 2
        }
      ];
      let StoreType = Auth.getStoreType();
      let StoreId = Auth.getStoreId();
      if (StoreType && StoreId) {
        Indicator.open();
        addMobileShoppingCart(data)
          .then(response => {
            if (response.success) {
              this.$nextTick(() => {
                 Indicator.close()
                Indicator.close();
                Toast("已加入购物车");
              });
            } else {
              Indicator.close()
              Toast(response.message);
            }
            Indicator.close();
          })
          .catch(error => {
            Indicator.close();
            Toast(error.message);
          });
      } else {
         Indicator.close()
        Toast("请先选择门店！");
        return;
      }
    }
  }
};
</script>
<style scoped lang="less">
// .defaultimg {
//   background: url(/static/images/icon/cart.svg) no-repeat;
//   height: 21px;
//   width: 20px;
//   border: none;
//   outline: none;
//   background-size: 20px;
// }
</style>

