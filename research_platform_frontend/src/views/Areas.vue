<template>
  <v-container fill-height fluid class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="areasHeaders"
          :items="areas"
          hide-default-footer
          class="area-table"
          @click:row="openArea"
        >
        </v-data-table>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import areas from "../data/areas.json";

export default {
  name: "Areas",
  data: () => ({
    drawer: false,
    areas: areas,
    areasHeaders: [
      { text: "Area", value: "area" },
      { text: "Created at", value: "created_at" },
      { text: "Updated at", value: "updated_at" },
      { text: "Made by", value: "made_by" },
    ],
  }),
  methods: {
    openArea(value) {
      const areaId = value.id;
      const areaName = value.area;
      this.$router.push({
        name: "areas/:id",
        params: { id: areaId, title: areaName },
      });
    },
  },
};
</script>

<style scoped>
.area-table >>> tbody tr:hover {
  cursor: pointer;
}
</style>
