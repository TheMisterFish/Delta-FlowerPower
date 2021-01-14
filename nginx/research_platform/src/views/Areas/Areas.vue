<template>
  <v-container class="pa-8 align-start">
    <v-data-table
      :headers="areasHeaders"
      :items="areas.areas"
      class="area-table"
      @click:row="openArea"
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
    <AddButton to="areas/add" />
  </v-container>
</template>

<script>
import AddButton from "../../components/AddButton";
import { STATUS } from "../../store/storeResponse";
import { mapState } from "vuex";

export default {
  name: "Areas",
  components: {
    AddButton,
  },
  data: () => ({
    areasHeaders: [
      { text: "Area", value: "name" },
      { text: "Description", value: "description" },
      { text: "Created at", value: "created_at" },
      { text: "Updated at", value: "updated_at" },
      { text: "Made by", value: "made_by.fullname" },
    ],
  }),
  computed: {
    ...mapState(["areas"]),
  },
  methods: {
    openArea(value) {
      this.$router.push({
        name: "areas/:id",
        params: { id: value._id, title: value.name },
      });
    },
  },
  created: async function() {
    const response = await this.$store.dispatch("getAreas");

    if (response.status === STATUS.ERROR) {
      this.$store.dispatch("showSnackbar", response.message);
    }
  },
};
</script>

<style scoped>
.area-table >>> tbody tr:hover {
  cursor: pointer;
}
</style>
