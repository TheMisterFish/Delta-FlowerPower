<template>
  <div class="page-container" id="dashboard">
    <Navbar />
    <div class="page-body">
      <Card style="grid-area: flower-map;">
        <span class="card-title" slot="card-title"
          >Bloemen kaart Nederland</span
        >
        <div slot="card-body">
          Body component
        </div>
      </Card>
      <Card style="grid-area: recent-results;">
        <span class="card-title" slot="card-title"
          >Recente onderzoeksresultaten</span
        >
        <Table slot="card-body">
          <tr slot="header">
            <th>Onderzoek</th>
            <th>Aantal bloemen</th>
          </tr>
          <tr
            slot="row"
            v-for="recentResearch in recentResearches"
            :key="recentResearch.onderzoek"
          >
            <td>{{ recentResearch.research }}</td>
            <td>{{ recentResearch.flower_count }}</td>
          </tr>
        </Table>
      </Card>
      <Card style="grid-area: unfinished-researches;">
        <span class="card-title" slot="card-title"
          >Onafgemaakte onderzoeken</span
        >
        <Table slot="card-body">
          <tr slot="header">
            <th>Onderzoek</th>
            <th>Datum</th>
          </tr>
          <tr
            slot="row"
            v-for="unfinishedResearch in unfinishedResearches"
            :key="unfinishedResearch.onderzoek"
          >
            <td>{{ unfinishedResearch.research }}</td>
            <td>{{ unfinishedResearch.date }}</td>
          </tr>
        </Table>
      </Card>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Card from "../components/Card.vue";
import Table from "../components/Table.vue";
import recentResearches from "../data/recentResearches.json";
import unfinishedResearches from "../data/unfinishedResearches.json";

export default {
  name: "dashboard",
  components: {
    Navbar,
    Card,
    Table,
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
