<template>
  <div id="dashboard">
    <Navbar/>
    <button @click="logout">Logout!</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";

export default Vue.extend({
  name: "dashboard",
  components: {
    Navbar
  },
  methods: {
    logout() {
      this.$store.dispatch("logout")
      this.$router.push("landing");
    }
  }
});
</script>
