<template>
  <div class="pa-8" id="dashboard">
    <v-card flat style="grid-area: flower-map;">
      <v-card-title>Flower map</v-card-title>
    </v-card>
    <v-data-table
      :headers="recentResearchesHeaders"
      :items="recentResearches"
      hide-default-footer
      style="grid-area: recent-results;"
    ></v-data-table>
    <v-data-table
      hide-default-footer
      style="grid-area: unfinished-researches;"
    ></v-data-table>
  </div>
</template>

<script>
import recentResearches from "../data/recentResearches.json";
export default {
  name: "Dashboard",
  data: () => ({
    drawer: false,
    recentResearches: recentResearches,
    recentResearchesHeaders: [
      { text: "Research", value: "research" },
      { text: "Flower count", value: "flower_count" },
    ],
  }),
};
</script>

<style scoped>
#dashboard {
  display: grid;
  grid-template-areas:
    "flower-map recent-results"
    "flower-map unfinished-researches";
  grid-template-columns: 2fr 1fr;
  gap: 29px;

  height: 100%;
}
</style>
