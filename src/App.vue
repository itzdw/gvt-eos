<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import "@/components/grid/index.css"
import "mint-ui/lib/style.css"
import "./style/style.less"
export default {
  name: "App",
};
</script>

<style lang="less">
html {
  -webkit-tap-highlight-color: transparent;
}
button, input {
  outline:none;
}
body {
  margin: 0;
  background-color: #fafafa;
}
#app{
    max-width:750px;
    margin: 0 auto;
}
</style>
