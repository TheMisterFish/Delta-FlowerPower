<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col>
        <v-card class="card ma-auto pa-8 pb-4" flat>
          <v-text-field
            outlined
            v-model="name"
            label="Name"
            required
          ></v-text-field>

          <v-textarea
            outlined
            label="description"
            v-model="description"
            rows="2"
          ></v-textarea>
          <AreaMap class="my-4" style="min-height: 500px" />
          <v-card-actions class="d-flex justify-space-between">
            <v-btn @click="cancel" text color="error">
              Cancel
            </v-btn>
            <v-btn @click="save" color="primary">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import AreaMap from "../../components/AreaMap.vue";
import { STATUS } from "../../store/storeResponse";
export default {
  name: "Area",
  components: {
    AreaMap,
  },
  data: () => ({
    name: "",
    description: "",
  }),
  computed: {
    ...mapState(["areas"]),
    _id() {
      return this.$route.params.id;
    },
    area: function() {
      return this.areas.areas.find((area) => area._id === this._id);
    },
  },
  methods: {
    cancel() {
      this.$router.push({
        name: "areas/:id",
        params: { id: this._id, title: name },
      });
    },
    async save() {
      const response = await this.$store.dispatch("updateArea", {
        _id: this._id,
        area: { name: this.name, description: this.description },
      });

      if (response.status === STATUS.SUCCESS) {
        this.$router.push({
          name: "areas/:id",
          params: { id: this._id, title: name },
        });
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    },
  },
  created: async function() {
    if (!this.area) {
      const response = await this.$store.dispatch("editArea", this._id);

      if (response.status === STATUS.SUCCESS) {
        this.name = response.data.name;
        this.description = response.data.description;
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    } else {
      this.name = this.area.name;
      this.description = this.area.description;
    }
  },
};
</script>

<style scoped>
.card {
  max-width: 800px;
}
</style>
