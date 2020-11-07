<template>
  <div class="page-container" id="dashboard">
    <Navbar />
    <div class="page-body">
      <md-card style="grid-area: flower-map">
        <md-card-header class="md-title">
          Bloemen kaart Nederland
        </md-card-header>
      </md-card>
      <md-table style="grid-area: recent-results" md-card>
        <md-table-toolbar class="md-title">
          Recente onderzoeksresultaten
        </md-table-toolbar>
        <md-table-row>
          <md-table-head>Onderzoek</md-table-head>
          <md-table-head>Aantal bloemen</md-table-head>
        </md-table-row>
        <md-table-row
          v-for="recentResearch in recentResearches"
          :key="recentResearch.onderzoek"
        >
          <md-table-cell>{{ recentResearch.research }}</md-table-cell>
          <md-table-cell>{{ recentResearch.flower_count }}</md-table-cell>
        </md-table-row>
      </md-table>

      <md-table style="grid-area: unfinished-researches" md-card>
        <md-table-toolbar class="md-title">
          Onafgemaakte onderzoeken
        </md-table-toolbar>
        <md-table-row>
          <md-table-head>Onderzoek</md-table-head>
          <md-table-head>Datum</md-table-head>
        </md-table-row>
        <md-table-row
          v-for="unfinishedResearch in unfinishedResearches"
          :key="unfinishedResearch.research"
        >
          <md-table-cell>{{ unfinishedResearch.research }}</md-table-cell>
          <md-table-cell>{{ unfinishedResearch.date }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import recentResearches from "../data/recentResearches.json";
import unfinishedResearches from "../data/unfinishedResearches.json";

export default {
  name: "dashboard",
  components: {
    Navbar
  },
  data: function() {
    return {
      recentResearches: recentResearches,
      unfinishedResearches: unfinishedResearches,
    };
  },
};
</script>

<style scoped>
.page-body {
  display: grid;
  grid-template-areas:
    "flower-map recent-results"
    "flower-map unfinished-researches";
  grid-template-columns: 2fr 1fr;
  gap: 29px;
}
</style>
