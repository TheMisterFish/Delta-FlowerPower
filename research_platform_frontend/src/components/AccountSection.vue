<template>
  <div id="account-section">
    <Link to="me" label="Gebruiker #129038" />
    <button @click="logout" class="logout">
      <ExitToApp />
    </button>
  </div>
</template>

<script>
import Vue from "vue";
import Link from "./Link.vue";
import ExitToApp from "vue-material-design-icons/ExitToApp.vue";

export default Vue.extend({
  name: "AccountSection",
  components: {
    Link,
    ExitToApp,
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("landing");
    },
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

#account-section .logout {
  display: inherit;
  border: none;
  background: none;
  margin-left: 25px;
  padding: 0px;
  color: var(--grey-color);
}

#account-section .logout svg {
  display: inherit;
}

#account-section .logout:hover {
  color: white;
  cursor: pointer;
}
</style>
