<template>
  <v-container class="pa-8">
    <v-row>
      <v-col v-for="(model, index) in models.models" :key="index">
        <v-card @click="openModel(model)" class="ma-auto pa-8 pb-4">
          <v-card-title class="pl-0 pt-0"
            >{{ model.name }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-subtitle class="pl-0">{{
            model.description
          }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddButton from "../../components/AddButton";
import { STATUS } from "../../store/storeResponse";
import { mapState } from "vuex";

export default {
  name: "Models",
  data: () => ({
    modelsHeaders: [
      { text: "Model", value: "name" },
      { text: "Description", value: "description" },
      { text: "Created at", value: "created_at" },
      { text: "Updated at", value: "updated_at" },
      { text: "Made by", value: "made_by" },
    ],
  }),
  computed: {
    ...mapState(["models"]),
  },
  methods: {
    openModel(value) {
      this.$router.push({
        name: "models/:id",
        params: { id: value._id, title: value.name },
      });
    },
  },
  created: async function() {
    const response = await this.$store.dispatch("getModels");

    if (response.status === STATUS.ERROR) {
      this.$store.dispatch("showSnackbar", response.message);
    }
  },
};
</script>
