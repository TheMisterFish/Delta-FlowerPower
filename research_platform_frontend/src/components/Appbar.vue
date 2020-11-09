<template>
  <v-app-bar id="appbar" dark color="primary">
    <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>{{title}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <span>Gebruiker 12391203 </span>
    <v-btn to="/logout" icon>
      <v-icon>mdi-exit-to-app</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "Appbar",
  props: ["title"],
  methods: {
    openDrawer() {
      this.$emit('open-drawer');
    }
  }
};
</script>

<style scoped>
#appbar {
  flex: 0;
}
</style>
