<template>
  <div class="Home">

    <!-- <home-search-header></home-search-header> -->

    <home-swipe :slide-show-url-list="slideShowUrlList"></home-swipe>

    <home-category :pro-class-list="proClassList"></home-category>

    <home-product-list :pro-class-list="proClassList"></home-product-list> 

    <back-top></back-top>
  </div>
</template>

<script>
import HomeSwipe from "./components/HomeSwipe"
import HomeCategory from "./components/HomeCategory"
import HomeProductList from "./components/HomeProductList"
import BackTop from "@/components/backTop";
import { 
    getIndexInfo
  } from "@/api/home";
  
export default {
  name: "home",
  components: { HomeSwipe, HomeCategory, HomeProductList, BackTop },
  data() {
    return {
      proClassList: [],
      slideShowUrlList: [],
      classCode: "",
    }
  },
  created() {
    getIndexInfo().then(response => {
      if(response.success) {
        this.proClassList = response.data.proClassList;
        this.slideShowUrlList = response.data.slideShowUrlList;
      }
    })
  },
  methods: {
  }
};
</script>


