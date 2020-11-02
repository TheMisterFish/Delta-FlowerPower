<template>
  <div id="landing">
    <LoginForm />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import LoginForm from "@/components/LoginForm.vue";

export default Vue.extend({
  name: "landing",
  components: {
    LoginForm,
  },
});
</script>

<style scoped>
#landing {
  display: grid;
  place-items: center;

  height: 100vh;
  background-image: linear-gradient(
      to top left,
      rgba(13, 59, 14, 0.8),
      50%,
      rgba(147, 245, 149, 0.4) 100%
    ),
    url("../assets/landing_background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
