<template>
  <div class="page-container" id="gebieden">
    <Navbar />
    <div class="page-body">
      <Card class="card">
        <span class="card-title" slot="card-title">Gebieden</span>
        <Table slot="card-body">
          <tr slot="header">
            <th>Gebied</th>
          </tr>
          <tr slot="row" v-for="area in areas" :key="area.area">
            <td>{{ area.area }}</td>
          </tr>
        </Table>
      </Card>
      <FloatingActionButton label="Nieuw gebied" />
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Card from "../components/Card.vue";
import Table from "../components/Table.vue";
import FloatingActionButton from "../components/FloatingActionButton.vue";
import areas from "../data/areas.json";

export default {
  name: "gebieden",
  components: {
    Navbar,
    Card,
    Table,
    FloatingActionButton
  },
  data: function() {
    return {
      areas: areas,
    };
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex: 1;
  margin-bottom: 25px;
}
</style>
