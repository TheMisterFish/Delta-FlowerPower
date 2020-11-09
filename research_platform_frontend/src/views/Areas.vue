<template>
  <div class="pa-8">
    <v-data-table
      :headers="areasHeaders"
      :items="areas"
      hide-default-footer
      style="grid-area: recent-results;"
    ></v-data-table>
    <v-btn
      to="/areas/add"
      bottom
      fixed
      right
      color="primary"
      elevation="2"
      fab
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "Areas",
  data: () => ({
    drawer: false,
    areas: [],
    areasHeaders: [{ text: "Area", value: "area" }],
  }),
};
</script>
