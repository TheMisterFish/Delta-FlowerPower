<template>
  <div class="page-container" id="gebruikers">
    <Navbar />
    <div class="page-body">
      <Card class="card">
        <span class="card-title" slot="card-title">Gebieden</span>
        <Table slot="card-body">
          <tr slot="header">
            <th>Email</th>
            <th>Volledige naam</th>
            <th>Rol</th>
          </tr>
          <tr slot="row" v-for="user in users" :key="user.email">
            <td>{{ user.email }}</td>
            <td>{{ user.fullName }}</td>
            <td>{{ user.role }}</td>
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
import users from "../data/users.json";

export default {
  name: "gebruikers",
  components: {
    Navbar,
    Table,
    Card,
  },
  data: function() {
    return {
      users: users,
    };
  },
};
</script>

<style scoped>
.page-body {
  display: flex;
}

.card {
  display: flex;
  flex: 1;
}
</style>