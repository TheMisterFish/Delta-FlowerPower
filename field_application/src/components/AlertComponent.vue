<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ alert_text }}
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "alert",
  data: () => ({
    snackbar: false,
    timeout: 2000,
  }),
  computed: {
    alert_text() {
      return this.$store.getters.alertText;
    },
  },
  watch: {
    "$store.state.hasAlert": function () {
      if (this.$store.state.hasAlert) this.snackbar = true;
    },
  },
};
</script>