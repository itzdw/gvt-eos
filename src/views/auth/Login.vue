<template>
  <div class="Login">
    <img class="logo" src="//47.75.105.17:22124/group1/M00/01/07/wKi5SlvrjQCAANGMAAAR2Ug-7l4909.png" alt="优订购" />
    <mt-field label="账户" type="text" placeholder="请输入账户" v-model="form.username" @keyup.enter.native="submit"></mt-field>
    <mt-field label="密码" type="password" placeholder="请输入密码" v-model="form.password" @keyup.enter.native="submit"></mt-field>
    <div style="padding: 0 10px;">
      <mt-button type="primary" size="large" @click.native="submit">登录</mt-button>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/auth"
import { Indicator, Toast } from "mint-ui"
import md5 from "js-md5";
import Auth from "@/utils/auth"

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    }
  },
  created() {
    Auth.getStoreId() && Auth.removeStoreId();
    Auth.getStoreType() && Auth.removeStoreType();
    
  },
  methods: {
    submit() {
      Indicator.open()
      const params = Object.assign({}, this.form, { password: md5(this.form.password) })

      login(params).then(response => {
        const jwt = response.data.token
        Auth.setToken(jwt)
        this.$router.push("/")
        Indicator.close()
      }).catch(error => {
        Indicator.close()
        this.$nextTick(() => {
          Toast("账户或密码错误")
        })
      })
    }
  }
}
</script>

<style lang="less">
.Login {
  .logo {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 20px auto;
  }
}
</style>

