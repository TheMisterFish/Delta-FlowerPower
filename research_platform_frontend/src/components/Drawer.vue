<template>
  <v-navigation-drawer v-model="visible" absolute temporary>
    <v-list>
      <v-list-item to="/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>
      <v-list-item to="/researches">
        <v-list-item-icon>
          <v-icon>mdi-feature-search</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Researches</v-list-item-title>
      </v-list-item>
      <v-list-item to="/areas">
        <v-list-item-icon>
          <v-icon>mdi-map</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Areas</v-list-item-title>
      </v-list-item>
      <v-list-item to="/models">
        <v-list-item-icon>
          <v-icon>mdi-brain</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Models</v-list-item-title>
      </v-list-item>
      <v-list-item to="/users">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Users</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Drawer",
  data: () => ({
    visible: false,
  }),
};
</script>
