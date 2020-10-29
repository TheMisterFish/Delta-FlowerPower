<template>
  <div id="landing">
    <Navbar/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";

export default Vue.extend({
  name: "onderzoeken",
  components: {
    Navbar
  },
});
</script>
