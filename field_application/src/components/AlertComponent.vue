<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
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
      alert_active () {
         return this.$store.getters.hasAlert;
      },
      alert_text () {
         return this.$store.getters.alertText;
      }
    },
    watch: {
      alert_active (newCount, oldCount) {
        if(newCount)
          this.snackbar = newCount;
      }
    }
  }
</script>