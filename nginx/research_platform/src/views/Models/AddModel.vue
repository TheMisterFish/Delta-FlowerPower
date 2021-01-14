<template>
  <v-container class="pa-8 align-start fill-height justify-center">
    <v-card width="600" class="pa-8">
      <v-text-field
        outlined
        v-model="name"
        label="Name"
        required
      ></v-text-field>
      
      <v-textarea outlined v-model="description" label="Description" auto-grow>
      </v-textarea>

      <v-btn @click="addModel" color="primary">Add Model</v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { STATUS } from "../../store/storeResponse";
export default {
  name: "AddModel",
  data: () => ({
    name: "",
    description: "",
  }),
  methods: {
    async addModel() {
      const response = await this.$store.dispatch("addModel", {
        name: this.name,
        description: this.description,
      });

      if (response.status === STATUS.SUCCESS) {
        this.$router.push({ name: "models" });
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    },
  },
};
</script>
