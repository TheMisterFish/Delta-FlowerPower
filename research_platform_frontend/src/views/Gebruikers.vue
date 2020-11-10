<template>
  <div id="gebruikers">
    <Navbar/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";

export default Vue.extend({
  name: "gebruikers",
  components: {
    Navbar
  },
});
</script>
