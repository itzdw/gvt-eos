<template>
  <div class="backTop" @click="toTop" v-show="show">
    <img src="/static/images/icon/top.svg" width="15" height="15"/> <br>
    顶部
  </div>
</template>
<style>
.backTop{
  width: 30px;
  font-size: 12px;
  text-align: center;
  position: fixed;
  right: 5px;
  bottom: 28%;
  z-index: 1000;
  background: #f4f4f4;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #ccc;
}
</style>
<script>
  export default {
    data() {
      return {
        show: false
      };
    },
    methods: {
      toTop() {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      },
    },
    mounted() {
      window.onscroll = () => {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
          this.show = true;
        } else {
          this.show = false;
        }
      };
    },
    beforeDestory() {
      window.onscroll = null;
    },
  };
</script>

