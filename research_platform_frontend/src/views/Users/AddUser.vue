<template>
  <v-container class="pa-8 align-start fill-height">
    <v-row>
      <v-col cols="12">
        <v-card class="fill-height px-8">
          <v-row>
            <v-col cols="12">
              <v-text-field
                outlined
                v-model="name"
                label="Name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                outlined
                v-model="email"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                outlined
                v-model="password"
                label="Password"
                required
                type="password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete v-model="role" :items="roles" chips label="Role">
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-btn @click="addUser" color="primary">Add user</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { STATUS } from "../../store/storeResponse";
export default {
  name: "AddUser",
  data: () => ({
    name: "",
    email: "",
    password: "",
    role: "",
    roles: ["admin", "moderator", "guest"],
  }),
  methods: {
    async addUser() {
      const response = await this.$store.dispatch("addUser", {
        fullname: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
      });

      if (response.status === STATUS.SUCCESS) {
        this.$router.push({ name: "users" });
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    },
  },
};
</script>
