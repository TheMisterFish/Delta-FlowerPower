<template>
  <div id="navigation-section">
    <Link to="dashboard" label="Dashboard" />
    <Link to="onderzoeken" label="Onderzoeken" />
    <Link to="gebieden" label="Gebieden" />
    <Link to="gebruikers" label="Gebruikers" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Link from "./Link.vue";

export default Vue.extend({
  name: "NavigationSection",
  components: {
    Link,
  },
});
</script>

<style scoped>
#navigation-section {
  display: flex;
  flex: 0.25;
  align-items: center;
  justify-content: space-between;
}
</style>
