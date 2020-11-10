<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">
    <Appbar
      @open-drawer="openDrawer"
      @navigate-back="navigateBack"
      :title="title.title"
      :user="authentication.user"
      :toggleDrawer="toggleDrawer"
      :actionPage="actionPage"
      v-if="authentication.isAuthenticated"
    />
    <v-main>
      <router-view />
    </v-main>
    <Drawer
      ref="drawer"
      :visible="drawer"
      v-if="authentication.isAuthenticated"
    />
    <v-snackbar color="error" light v-model="snackbar.visible">{{
      snackbar.message
    }}</v-snackbar>
  </v-app>
</template>

<script>
import Appbar from "./components/Appbar.vue";
import Drawer from "./components/Drawer.vue";
import { mapState } from "vuex";
import router from "./router";

export default {
  name: "App",
  components: {
    Appbar,
    Drawer,
  },
  data: () => ({
    message: "",
    drawer: false,
    toggleDrawer: true,
    actionPage: false,
  }),

  computed: {
    ...mapState(["snackbar"]),
    ...mapState(["authentication"]),
    ...mapState(["title"]),
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },

  watch: {
    $route(to) {
      this.toggleDrawer = to.meta.drawer;
      this.actionPage = to.meta.action;
    },
  },

  methods: {
    openDrawer() {
      this.$refs.drawer.visible = true;
    },
    navigateBack() {
      router.go(-1);
    }
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
  background-color: var(--grey-color);
}
</style>
