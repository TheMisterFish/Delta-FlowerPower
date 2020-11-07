<template>
  <div class="page-container" id="onderzoeken">
    <Navbar />
    <div class="page-body">
      <Card class="card">
        <span class="card-title" slot="card-title">Onderzoeken</span>
        <Table slot="card-body">
          <tr slot="header">
            <th>Onderzoek</th>
            <th>Gebied</th>
            <th>Aantal bloemen</th>
            <th>Datum aangemaakt</th>
            <th>Laatst gewijzigd op</th>
          </tr>
          <tr slot="row" v-for="row in rows" :key="row.onderzoek">
            <td>{{ row.research }}</td>
            <td>{{ row.area }}</td>
            <td>{{ row.flower_count }}</td>
            <td>{{ row.created }}</td>
            <td>{{ row.updated }}</td>
          </tr>
        </Table>
      </Card>
      <FloatingActionButton label="Nieuw onderzoek"/>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Card from "../components/Card.vue";
import Table from "../components/Table.vue";
import FloatingActionButton from "../components/FloatingActionButton.vue";
import researches from "../data/researches.json";

export default {
  name: "onderzoeken",
  components: {
    Navbar,
    Card,
    Table,
    FloatingActionButton
  },
  data: function() {
    return {
      rows: researches,
    };
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex: 1;
}
</style>
