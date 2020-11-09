<template>
  <div>logout</div>
</template>

<script>
export default {
  name: "Logout",
  created: function() {
    this.$store.dispatch("logout");
    this.$router.push("landing");
  },
};
</script>
