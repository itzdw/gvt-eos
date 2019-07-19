<template>
  <mt-search v-model="value" autofocus>
    <br>
    <mt-cell
      is-link
      to="/home"
      v-for="item in result"
      :key="item.id"
      :title="item.name"
      :label="item.desc">
    </mt-cell>
  </mt-search>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      result: this.mockData()
    }
  },

  methods: {
    mockData() {
      let result = []
      for(let i = 0; i <= 10; i ++) {
        result.push({
          id: i,
          name: `奶粉-${i+1}`,
          desc: "商品描述...",
        })
      }

      return result
    }
  }
}
</script>

