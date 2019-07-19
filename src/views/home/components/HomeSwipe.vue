<template>
  <div class="HomeSwipe">
    <mt-swipe :auto="3000" :show-indicators="false">
      <mt-swipe-item v-for="(item,index) in slideShowList" :key="`${item.name}_${index}`">
        <img :src="item.imageUrl" :alt="item.name"/>
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
export default {
  props: {
    slideShowUrlList: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      slideShowList: this.slideShowUrlList,
    }
  },
  watch: {
    slideShowUrlList(val) {
      this.slideShowList = val;
    }
  },
  mounted() {
  }
}
</script>