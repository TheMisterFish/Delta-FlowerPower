<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="usersHeaders"
          :items="users.users"
          hide-default-footer
          class="user-table"
          @click:row="openUser"
        >
          <template v-slot:[`item.created_at`]="{ item }">
            <span>{{ new Date(item.created_at).toDateString() }}</span>
          </template>

          <template v-slot:[`item.updated_at`]="{ item }">
            <span>{{
              item.updated_at ? new Date(item.updated_at).toDateString() : ""
            }}</span>
          </template>
        </v-data-table>
        <v-btn
          :to="{ name: 'users/add' }"
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
import { mapState } from "vuex";
import { STATUS } from "../../store/storeResponse";

export default {
  name: "Users",
  data: () => ({
    usersHeaders: [
      { text: "Name", value: "fullname" },
      { text: "Email", value: "email" },
      { text: "Role", value: "role" },
    ],
  }),
  computed: {
    ...mapState(["users"]),
  },
  methods: {
    openUser(value) {
      console.log(value);
      // const areaId = value._id;
      // const areaName = value.area;
      // this.$router.push({
      //   name: "areas/:id",
      //   params: { id: areaId, title: areaName },
      // });
    },
  },
  created: async function() {
    const response = await this.$store.dispatch("getUsers");

    if (response.status === STATUS.ERROR) {
      this.$store.dispatch("showSnackbar", response.message);
    }
  },
};
</script>

<style scoped>
.user-table >>> tbody tr:hover {
  cursor: pointer;
}
</style>
