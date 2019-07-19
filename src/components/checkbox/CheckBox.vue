<template>
  <label class="mint-checklist-label">
    <span class="mint-checkbox">
      <input type="checkbox" class="mint-checkbox-input" v-model="checked"/>
      <span class="mint-checkbox-core"></span>
    </span> 
    <span class="mint-checkbox-label">
      <slot></slot>
    </span>
  </label>
</template>

<script>
export default {
  name: "CheckBox",

  model: {
    prop: "isChecked",
  },

  props: {
    isChecked: Boolean,
    value: {
      type: [String, Boolean],
      default: ""
    }
  },

  data() {
    return {
      checked: this.value === "" ? this.isChecked : this.value
    }
  },

  watch: {
    value(val) {
      this.checked = val
    },

    isChecked(val) {
      this.checked = val
    },

    checked(val) {
      this.$emit("input", val)
      this.$emit("on-change", val)
    }
  }

}
</script>

