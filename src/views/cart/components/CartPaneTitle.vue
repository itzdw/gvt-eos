<template>
  <div class="CartPaneTitle">
    <check-box :value="checked" @click.prevent.native="checkAll">{{ warehouseName }}</check-box>
  </div>
</template>

<script>
import CheckBox from "@/components/checkbox"

export default {
  name: "CartPaneTitle",

  components: { CheckBox },

  props: {
    warehouseName: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      checked: false
    }
  },

  watch: {
    checked() {
      // 告知跟组件 Index.vue 仓库选项发生了变化
      // 用以更新底部 "全选" 勾选状态
      this.$bus.emit("warehouse-checked-changed")
    }
  },

  methods: {
    checkAll() {
      this.checked = !this.checked
      this.$emit("on-warehouse-checked-change", this.checked)
    }
  }
}
</script>

<style scoped lang="less">
.CartPaneTitle .mint-checklist-label{
  padding: 0;
  margin-left: 3px;
}
</style>
