<template>
  <div class="CartPaneItemStepper">
    <button type="button" class="minus" :disabled="!decreasable" @click.prevent="decrease"></button>
    <input
      class="input"
      :value="currentValue"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      @change="change"
      @input="change"
      autocomplete="off"
      ref="input_number"
    >
    <button type="button" class="plus" :disabled="!increasable" @click.prevent="increase"></button>
  </div>
</template>

<script>
const isNaN = Number.isNaN || window.isNaN;
const REGEXP_NUMBER = /^-?(?:\d+|\d+\.\d+|\.\d+)(?:[eE][-+]?\d+)?$/;
const REGEXP_DECIMALS = /\.\d*(?:0|9){10}\d*$/;
const normalizeDecimalNumber = (value, times = 100000000000) =>
  REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;

export default {
  name: "CartPaneItemStepper",

  props: {
    value: {
      type: [Number],
      default: 0
    },
    baseInfo:{
      type:Object,
      default:()=>{}
    },
    // max: {
    //   type: [Number],
    //   default: Infinity
    // },
    // min: {
    //   type: [Number],
    //   default: 1
    // },
    // step: {
    //   type: [Number],
    //   default: 1
    // }
  },

  data() {
    return {
      currentValue: NaN,
      max:this.baseInfo.stockNum,
      min:this.baseInfo.minQueryLimit,
      step:1,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue, oldValue) {
        if (
          !(isNaN(newValue) && typeof oldValue === "undefined") &&
          newValue !== this.currentValue
        ) {
          this.setValue(newValue);
        }
      }
    }
  },

  computed: {
    increasable() {
      const num = this.currentValue;
      return isNaN(num) || num < this.max;
    },

    decreasable() {
      const num = this.currentValue;
      return isNaN(num) || num > this.min;
    },
  },

  methods: {
    //加法，加法，修改input的值（currentValue）
    setValue(value) {
      const oldValue = this.currentValue;
      let newValue = value;
      if (this.min <= this.max) {
        newValue = Math.min(this.max, Math.max(this.min, newValue));
      }
      this.$nextTick(() => {
        this.currentValue = newValue;
        this.$emit("input", newValue);                              
        this.$emit("on-change", newValue, oldValue);
      });
    },

    change(event) {
      let value = event.target.value;
      if(!value) {
        value = 0;
      }
      // 转换成整数，数量只能为整数
      let val = parseInt(value);
      this.currentValue = val;
      this.$refs.input_number.value=val;
      // if (event.type == "input" && val.match(/^\-?\.?$|\.$/)) return;

      const { min, max } = this;
      const isEmptyString = val.length === 0;
      val = Number(val);

      if (isEmptyString) {
        this.currentValue = null;
        this.setValue(min);
        return;
      }

      if (event.type == "change") {
        if (val === this.currentValue && val > min && val < max) return;
      }

      if (!isNaN(val) && !isEmptyString) {
        this.currentValue = val;

        if (event.type == "input" && val < min) return;
        if (val > max) {
          this.setValue(max);
        } else if (val < min) {
          this.setValue(min);
        } else {
          this.setValue(val);
        }
      } else {
        event.target.value = this.currentValue;
      }
    },
//减法
    decrease() {
      if (this.decreasable) {
        let { currentValue } = this;
        if (isNaN(currentValue)) {
          currentValue = 0;
        }
        //数量减1
        this.setValue(
          Math.min(
            this.max,
            Math.max(this.min, normalizeDecimalNumber(currentValue - this.step))
          )
        );
      }
    },
//加法
    increase() {
      if (this.increasable) {
        let { currentValue } = this;
        if (isNaN(currentValue)) {
          currentValue = 0;
        }
        this.setValue(
          Math.min(
            this.max,
            Math.max(this.min, normalizeDecimalNumber(currentValue + this.step))
          )
        );
      }
    }
  }
};
</script>

<style lang="less">
.CartPaneItemStepper {
  font-size: 0;

  .input {
    width: 30px;
    height: 26px;
    padding: 1px;
    border: 0;
    margin: 1px;
    background-color: #f2f3f5;
    border-width: 1px 0;
    border-radius: 0;
    box-sizing: content-box;
    color: #323233;
    font-size: 14px;
    vertical-align: middle;
    text-align: center;
    -webkit-appearance: none;
    &[disabled] {
      color: #c8c9cc;
      background-color: #f2f3f5;
    }
  }

  .minus {
    border-radius: 4px 0 0 4px;
  }
  .plus {
    border-radius: 0 4px 4px 0;
  }

  .minus,
  .plus {
    width: 28px;
    height: 28px;
    box-sizing: border-box;
    background-color: #f2f3f5;
    border: 0;
    margin: 1px;
    position: relative;
    padding: 5px;
    vertical-align: middle;

    &:before {
      width: 9px;
      height: 1px;
    }

    &:after {
      width: 1px;
      height: 9px;
    }

    &[disabled] {
      background-color: #f7f8fa;
      &:before,
      &:after {
        background-color: #c8c9cc;
      }
    }
  }

  .minus {
    &:before {
      content: "";
      position: absolute;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #323233;
    }
  }

  .plus {
    &:after,
    &:before {
      content: "";
      position: absolute;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #323233;
    }
  }
}
</style>

