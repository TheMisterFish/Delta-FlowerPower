<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="researchesHeaders"
          :items="researches"
          hide-default-footer
          style="grid-area: recent-results;"
        ></v-data-table>
        <v-btn
          to="/researches/add"
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
import researches from "../data/researches.json";
export default {
  name: "Researches",
  data: () => ({
    drawer: false,
    researches: researches,
    researchesHeaders: [
      { text: "Research", value: "research" },
      { text: "Area", value: "area" },
      { text: "Flower count", value: "flower_count" },
      { text: "Created", value: "created" },
      { text: "Updated", value: "updated" },
    ],
  }),
};
</script>
