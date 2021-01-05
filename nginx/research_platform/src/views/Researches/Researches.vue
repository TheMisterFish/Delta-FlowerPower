<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="researchesHeaders"
          :items="researches.researches"
          hide-default-footer
          class="research-table"
          @click:row="openResearch"
        ></v-data-table>
        <v-btn
          to="/researches/add"
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
  name: "Researches",
  data: () => ({
    researchesHeaders: [
      { text: "Research", value: "name" },
      { text: "Description", value: "description" },
      { text: "Created at", value: "created_at" },
      { text: "Updated at", value: "updated_at" },
      { text: "Made by", value: "made_by.fullname" },
    ],
  }),
  computed: {
    ...mapState(["researches"]),
  },
  methods: {
    openResearch(value) {
      const researchId = value._id;
      const researchName = value.research;
      this.$router.push({
        name: "research/:id",
        params: { id: researchId, title: researchName },
      });
    },
  },
  created: async function() {
    const response = await this.$store.dispatch("getResearches");

    if (response.status === STATUS.ERROR) {
      this.$store.dispatch("showSnackbar", response.message);
    }
  },
};
</script>

<style scoped>
.research-table >>> tbody tr:hover {
  cursor: pointer;
}
</style>
