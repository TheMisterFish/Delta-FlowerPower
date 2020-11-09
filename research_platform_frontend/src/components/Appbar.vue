<template>
  <v-app-bar id="appbar" dark color="primary">
    <v-app-bar-nav-icon
      v-if="toggleDrawer"
      @click="openDrawer"
    ></v-app-bar-nav-icon>
    <v-btn v-else icon @click="navigateBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <span style="margin-right: 15px;">{{user.email}}</span>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            Instellingen
          </v-list-item-title>
        </v-list-item>
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
  props: ["title", "toggleDrawer", "user"],
  methods: {
    openDrawer() {
      this.$emit("open-drawer");
    },
    navigateBack() {
      this.$emit("navigate-back");
    },
  },
};
</script>

<style scoped>
#appbar {
  flex: 0;
}
</style>
