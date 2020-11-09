<template>
  <v-app-bar id="appbar" dark color="primary">
    <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <span>Gebruiker 12391203</span>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/logout">
          <v-list-item-title>
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "Appbar",
  props: ["title"],
  methods: {
    openDrawer() {
      this.$emit("open-drawer");
    },
  },
};
</script>

<style scoped>
#appbar {
  flex: 0;
}
</style>
