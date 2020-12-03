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
    "$store.getters.hasAlert": function () {
      if (this.$store.getters.hasAlert) this.snackbar = true;
    },
  },
};
</script>