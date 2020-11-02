<template>
  <nav id="navbar">
    <NavigationSection />
    <AccountSection />
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import NavigationSection from "./NavigationSection.vue";
import AccountSection from "./AccountSection.vue";

export default Vue.extend({
  name: "Navbar",
  components: {
    NavigationSection,
    AccountSection,
  },
});
</script>

<style scoped>
#navbar {
  display: flex;
  justify-content: space-between;
  background-color: var(--primary-color);
  height: 58px;
  padding: 0px 25px;
}
</style>
