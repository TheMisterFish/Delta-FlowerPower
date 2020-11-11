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
  },
  methods: {
    cancel() {
      this.$router.push({
        name: "areas/:id",
        params: { id: this._id, title: name },
      });
    },
    save() {
      this.$store
        .dispatch("updateArea", {
          _id: this._id,
          area: {
            name: this.name,
            description: this.description,
          },
        })
        .then(() => {
          this.$router.push({
            name: "areas/:id",
            params: { id: this._id, title: name },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created: function() {
    const _id = this._id;

    const area = this.areas.areas.find((a) => a._id === _id);

    if (!area) {
      this.$store
        .dispatch("getArea", _id)
        .then((response) => {
          this.name = response.data.name;
          this.description = response.data.description;
        })
        .catch((error) => {
          console.log("error:", error);
        });
    } else {
      this.name = area.name;
      this.description = area.description;
    }
  },
};
</script>

<style scoped>
.card {
  max-width: 800px;
}
</style>
