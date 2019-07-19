<template>
  <div class="HomeSearchHeader">
    <Row>
      <Col :span="10">
        <img class="logo" src="//47.75.105.17:22124/group1/M00/01/07/wKi5SlvrjQCAANGMAAAR2Ug-7l4909.png" alt="优订购" />      
      </Col>
      <Col :span="14" class="text-right selectField">
        <mt-field v-show="loginStatus" type="text" placeholder="请选择门店" v-model="storeName" :attr="{autocomplete:false}" @click.native="storeVisible = !storeVisible" readonly :disableClear="true">
          <img src="/static/images/icon/drop.svg" width="15" height="15"/>          
        </mt-field>
        <svg class="icon" aria-hidden="true" @click="userBtnClick">
          <use xlink:href="#icon-Userpersonavtar"></use>
        </svg>      
      </Col>
    </Row>
    <mt-field placeholder="查询" class="search" v-model="keyword">
      <img src="/static/images/icon/search.svg" width="27" height="27" @click="searchProduct"/>
    </mt-field>
    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
    <div class="storeSelection">
      <mt-actionsheet
        :actions="storeSelection"
        v-model="storeVisible">
      </mt-actionsheet>
    </div>
  </div>
</template>
<style>
.storeSelection .mint-actionsheet{
  max-height: 192px;
  overflow: auto;
}
.HomeSearchHeader .selectField .mint-cell{
  background-color: transparent;
  min-height: 30px;
  display: inline-block;
  width: 130px;
  overflow: hidden;
}
.HomeSearchHeader .selectField .mint-field-core {
  font-size: 12px;
}
.HomeSearchHeader .selectField .mint-cell-wrapper {
  padding: 0;
}
.text-right {
  text-align: right;
}
.HomeSearchHeader .icon {
  width: 25px;
  height: 25px;
  vertical-align: -0.15em;
  fill: currentColor;
  color: #666;
  overflow: hidden;
  margin: 5px;
}
.HomeSearchHeader .mint-field .mint-cell-value {
  background-color: #ffffff;
  border: 1px solid #e6e4e4;
  border-radius: 5px;
  padding: 3px;
}
.HomeSearchHeader .mint-field-core {
  background: transparent;
  /* color: #ffffff; */
}
.HomeSearchHeader .mint-field-core::-webkit-input-placeholder{
  color:#666;
}
.HomeSearchHeader .search img {
  width: 25px;
  height: 25px;
}
</style>

<script>
import Auth from "@/utils/auth"
import mixin from "@/mixins"
import { Toast } from "mint-ui";

export default {
  mixins: [mixin],

  data() {
    return {
      sheetVisible: false,
      storeVisible: false,
      storeName: "",
      keyword: "",
      storeSelection: [],
      actions: [
        { name: "注销", method: this.logout }
      ]
    }
  },

  mounted() {
    let shops = this.$store.getters.user.shops;
    this.storeSelection = shops.map(item => {
      item.name = item.name;
      item.method = this.selectionChange;
      return item;
    })
    let StoreId = Auth.getStoreId();   
    let selection = this.storeSelection.filter(item => {
      return item.id == StoreId;
    }) 
    if(StoreId && selection.length>0) {
      this.storeName = selection[0].name;
      this.$store.dispatch("SelectStore", selection[0].id)
    }
  },
  methods: {
    userBtnClick() {
      if(this.loginStatus) {
        this.sheetVisible = !this.sheetVisible
      }else {
        this.redirectLogin()
      }
    },
    searchProduct() {
      if(!this.keyword) {
        Toast('请输入关键字查询');
        return;
      }
      this.$router.push({
        name:'product-index',
        query:{
          keyword: this.keyword
        }
      })
    },
    logout() {
      this.$store.dispatch("Logout")
    },
    selectionChange(e){
      Auth.setStoreId(e.id);
      Auth.setStoreType("002");

      this.storeName = e.name;
      this.$store.dispatch("SelectStore", e.id);
      window.location.reload();
    }
  }
}
</script>


