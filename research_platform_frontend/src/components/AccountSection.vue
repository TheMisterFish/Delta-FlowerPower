<template>
  <div id="account-section">
    <Link to="me" label="Gebruiker #129038" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Link from "./Link.vue";

export default Vue.extend({
  name: "AccountSection",
  components: {
    Link,
  },
});
</script>

<style scoped>
#account-section {
  display: flex;
  flex: 0.2;
  align-items: center;
  justify-content: flex-end;
}
</style>
