<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-card flat>
              <v-card-title>Flower map</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="recentResearchesHeaders"
              :items="recentResearches"
              hide-default-footer
            ></v-data-table>
          </v-col>
          <v-col cols="12">
            <v-data-table hide-default-footer></v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
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