<template>
  <div>
    <div class="main">
      <home-search-header></home-search-header>
      <router-view></router-view>
    </div>

    <nav-bar></nav-bar>
    
  </div>
</template>

<script>
import NavBar from "@/components/navbar"
import HomeSearchHeader from "@/components/header"

export default {
  name: "ContainerRoot",
  components: { NavBar, HomeSearchHeader },
};
</script>

<style lang="less">
.main {
  padding-bottom: 56px;
}
</style>


