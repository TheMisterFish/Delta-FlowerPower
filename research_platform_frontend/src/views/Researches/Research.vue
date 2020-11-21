<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-card class="card ma-auto pa-8 pb-4" flat>
          <v-card-title class="pl-0 pt-0"
            >{{ research && research.name }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-subtitle class="pl-0">{{
            research && research.description
          }}</v-card-subtitle>
          <v-card-actions class="d-flex justify-space-between">
            <v-btn @click="deleteResearch" text color="error">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { STATUS } from "../../store/storeResponse";
export default {
  name: "Research",
  computed: {
    ...mapState(["researches"]),
    _id() {
      return this.$route.params.id;
    },
    research: function() {
      const _id = this._id;
      return this.researches.researches.find((r) => r._id === _id);
    },
  },
  methods: {
    deleteResearch() {
      const _id = this.research._id;
      this.$store
        .dispatch("deleteArea", _id)
        .then(() => {
          console.log("area deleted!");
          this.$router.push({ name: "areas" });
        })
        .catch((error) => {
          console.log("error :-(", error);
        });
    },
  },

  created: async function() {
    if (!this.research) {
      const response = await this.$store.dispatch("getResearch", this._id);

      if (response.status === STATUS.SUCCESS) {
        this.name = response.data.name;
        this.description = response.data.description;
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    }
  },
};
</script>

<style scoped>
.card {
  max-width: 800px;
}
</style>
