<template>
  <div id="gebieden">
    <Navbar/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";

export default Vue.extend({
  name: "gebieden",
  components: {
    Navbar
  },
});
</script>
