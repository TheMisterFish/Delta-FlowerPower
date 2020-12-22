<template>
  <v-container class="pa-8 align-start">
    <v-card class="card ma-auto pa-8 pb-4" flat>
      <v-card-title class="pl-0 pt-0"
        >{{ model && model.name }}
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-subtitle class="pl-0">{{
        model && model.description
      }}</v-card-subtitle>
      <v-list v-if="model">
        <v-list-item
          v-for="(weight, index) in model.weights"
          :key="index"
          class="d-flex align-center"
          ><div class="subheading">{{ weight.fileName }}</div>
          <v-btn @click="deleteWeights(weight)" icon
            ><v-icon color="error">mdi-minus</v-icon></v-btn
          ></v-list-item
        >
      </v-list>
      <v-file-input v-model="weights" label="Weights"></v-file-input>
      <v-btn :disabled="!weights" @click="uploadWeights" class="primary">
        Upload new weights
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { STATUS } from "../../store/storeResponse";
import { mapState } from "vuex";

export default {
  name: "Model",
  computed: {
    ...mapState(["models"]),
    _id() {
      return this.$route.params.id;
    },
    model: function() {
      const _id = this._id;
      return this.models.models.find((m) => m._id === _id);
    },
  },
  data: () => ({
    weights: null,
  }),
  methods: {
    async uploadWeights() {
      const data = new FormData();
      data.append("weights", this.weights);

      const response = await this.$store.dispatch("addModelWeights", {
        _id: this._id,
        weights: data,
      });
      this.weights = null
    },

    async deleteWeights(weights) {
      const response = await this.$store.dispatch("deleteModelWeights", {
        _id: this._id,
        weightsid: weights._id,
      });
    },
  },
  created: async function() {
    if (!this.model) {
      const response = await this.$store.dispatch("getModel", this._id);

      if (response.status === STATUS.ERROR) {
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
