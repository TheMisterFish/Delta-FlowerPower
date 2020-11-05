<template>
  <div id="dashboard">
    <Navbar />
    <div class="page-container dashboard-container">
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
        <div slot="card-body">
          <table class="table">
            <tr class="header">
              <th>Onderzoek</th>
              <th>Aantal bloemen</th>
            </tr>
            <tr class="row">
              <td>Onderzoek Hoge zwaluwe</td>
              <td>3449</td>
            </tr>
            <tr class="row">
              <td>Onderzoek Lage mierde</td>
              <td>3290</td>
            </tr>
            <tr class="row">
              <td>Onderzoek Noord-Holland</td>
              <td>2198</td>
            </tr>
          </table>
        </div>
      </Card>
      <Card style="grid-area: unfinished-researches;">
        <span class="card-title" slot="card-title"
          >Onafgemaakte onderzoeken</span
        >
        <div slot="card-body">
          <table class="table">
            <tr class="header">
              <th>Onderzoek</th>
              <th>Datum</th>
            </tr>
            <tr class="row">
              <td>Onderzoek Dommelbimd</td>
              <td>9-2-2020</td>
            </tr>
            <tr class="row">
              <td>Onderzoek Kennemerland</td>
              <td>23-4-2020</td>
            </tr>
            <tr class="row">
              <td>Onderzoek Engelermeer</td>
              <td>18-6-2020</td>
            </tr>
          </table>
        </div>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import Navbar from "../components/Navbar.vue";
import Card from "../components/Card.vue";

export default {
  name: "dashboard",
  components: {
    Navbar,
    Card,
  },
};
</script>

<style scoped>
#dashboard {
  display: grid;
  grid-template-areas:
    "navbar"
    "dashboard";
  grid-template-rows: 58px auto;

  height: 100vh;
}

.dashboard-container {
  grid-area: dashboard;
  display: grid;
  grid-template-areas:
    "flower-map recent-results"
    "flower-map unfinished-researches";
  grid-template-columns: 2fr 1fr;
  gap: 29px;
}

.dashboard-container .table {
  border-collapse: collapse;
  width: 100%;
  font-family: "Roboto";
  color: var(--grey-dark-color);
}

.dashboard-container .table th {
  padding: 0px 5px 10px 5px;
  border-bottom: 2px solid var(--grey-color);
  text-align: left;
  font-weight: 400;
  font-family: "Roboto";
}

.dashboard-container .table .row {
  border-bottom: 1px solid var(--grey-color);
}

.dashboard-container .table td {
  padding: 10px 5px;
}
</style>
