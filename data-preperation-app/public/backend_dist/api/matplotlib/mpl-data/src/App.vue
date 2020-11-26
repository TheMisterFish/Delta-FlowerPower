<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "app",
  created: async function() {
    const webSocket = await this.$store.dispatch("connectWebSocket");

    const self = this;

    webSocket.onmessage = function(event) {
      self.$store.dispatch("onWebSocketMessage", event.data);
    };
  },
};
</script>

<style>
:root {
  --primary-color: #567a58;
  --grey-color: #d4d4d4;
}

html {
  overflow-y: auto;

  font-size: 16px;
  font-family: "Roboto", sans-serif;
}

body {
  background-color: white;
}
</style>
