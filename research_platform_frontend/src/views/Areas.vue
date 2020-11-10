<template>
  <v-container fill-height fluid class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="areasHeaders"
          :items="areas.areas"
          hide-default-footer
          class="area-table"
          @click:row="openArea"
        >
        <template v-slot:[`item.created_at`]="{item}">
          <span>{{new Date(item.created_at).toDateString()}}</span>
        </template>

        <template v-slot:[`item.updated_at`]="{item}">
          <span>{{item.updated_at ? new Date(item.updated_at).toDateString() : ""}}</span>
        </template>
        </v-data-table>
        <v-btn
          :to="{ name: 'areas/add' }"
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
import { mapState } from 'vuex';

export default {
  name: "Areas",
  data: () => ({
    drawer: false,
    areasHeaders: [
      { text: "Area", value: "name" },
      { text: "Description", value: "description" },
      { text: "Created at", value: "created_at" },
      { text: "Updated at", value: "updated_at" },
      { text: "Made by", value: "made_by" },
    ],
  }),
  computed: {
    ...mapState(["areas"]),
  },
  methods: {
    openArea(value) {
      const areaId = value._id;
      const areaName = value.area;
      this.$router.push({
        name: "areas/:id",
        params: { id: areaId, title: areaName },
      });
    },
  },
  created: function() {
    this.$store
      .dispatch("getAreas")
      .then(() => {
        console.log("fetched!");
      })
      .catch(() => {
        console.log("error :-(");
      });
  },
};
</script>

<style scoped>
.area-table >>> tbody tr:hover {
  cursor: pointer;
}
</style>
