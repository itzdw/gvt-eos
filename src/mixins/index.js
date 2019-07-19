import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loginStatus: false
    }
  },

  computed: {
    ...mapGetters(["user"])
  },

  mounted() {
    this.loginStatus = this.user.id ? true : false
  },

  methods: {
    redirectLogin() {
      this.$router.push({name: "login"})
    }
  }
}