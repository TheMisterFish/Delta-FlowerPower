<template>
  <v-container class="pa-8 align-start">
    <v-data-table
      :headers="modelsHeaders"
      :items="models.models"
      hide-default-footer
      class="models-table"
      @click:row="openModel"
    >
      <template v-slot:[`item.created_at`]="{ item }">
        <span>{{ new Date(item.created_at).toDateString() }}</span>
      </template>

      <template v-slot:[`item.updated_at`]="{ item }">
        <span>{{
          item.updated_at && new Date(item.updated_at).toDateString()
        }}</span>
      </template>
    </v-data-table>
    <AddButton to="models/add"/>
  </v-container>
</template>

<script>
import AddButton from "../../components/AddButton";
import { STATUS } from "../../store/storeResponse";
import { mapState } from "vuex";

export default {
  name: "Models",
  components: {
    AddButton
  },
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

<style scoped>
.models-table >>> tbody tr:hover {
  cursor: pointer;
}
</style>
