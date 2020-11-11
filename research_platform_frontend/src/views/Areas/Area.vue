<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-card class="card ma-auto pa-8 pb-4" flat>
          <v-card-title class="pl-0 pt-0"
            >{{ area && area.name }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-subtitle class="pl-0">{{ area && area.description }}</v-card-subtitle>
          <AreaMap class="my-4" style="min-height: 500px" />
          <v-card-actions class="d-flex justify-space-between">
            <v-btn @click="deleteArea" text color="error">
              Delete
            </v-btn>
            <v-btn @click="editArea" color="primary">Edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import AreaMap from "../../components/AreaMap.vue";
export default {
  name: "Area",
  components: {
    AreaMap,
  },
  computed: {
    ...mapState(["areas"]),
    _id() {
      return this.$route.params.id;
    },
    area: function() {
      const _id = this._id;
      return this.areas.areas.find((area) => area._id === _id);
    },
  },
  methods: {
    deleteArea() {
      const _id = this.area._id;
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

    editArea() {
      const _id = this.area._id;
      const name = this.area.name;
      this.$router.push({
        name: "areas/:id/edit",
        params: { _id: _id, title: `Edit ${name}` },
      });
    },
  },
  created: function() {
    if (!this.area) {
      this.$store
        .dispatch("getArea", this._id)
        .then((response) => {
          this.name = response.data.name;
          this.description = response.data.description;
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  },
};
</script>

<style scoped>
.card {
  max-width: 800px;
}
</style>
