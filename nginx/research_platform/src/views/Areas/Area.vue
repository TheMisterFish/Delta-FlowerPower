<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-card class="card ma-auto pa-8 pb-4" flat>
          <v-card-title class="pl-0 pt-0"
            >{{ area && area.name }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-subtitle class="pl-0">{{
            area && area.description
          }}</v-card-subtitle>
          <AreaMap
            :coordinates="coordinates"
            :editable="false"
            class="my-4"
            style="min-height: 500px"
          />
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
import { STATUS } from "../../store/storeResponse";
export default {
  name: "Area",
  components: {
    AreaMap,
  },
  data: () => ({
    coordinates: [],
  }),
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
  watch: {
    area(newArea, oldArea) {
      this.parseCoordinates();
    },
  },
  methods: {
    async deleteArea() {
      const response = await this.$store.dispatch("deleteArea", this._id);

      if (response.status === STATUS.SUCCESS) {
        this.$router.push({ name: "areas" });
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    },

    editArea() {
      const _id = this.area._id;
      const name = this.area.name;
      this.$router.push({
        name: "areas/:id/edit",
        params: { _id: _id, title: `Edit ${name}` },
      });
    },

    parseCoordinates() {
      this.coordinates = [
        {
          lat: parseFloat(this.area.lat_long_point_one.split(",")[0]),
          lng: parseFloat(this.area.lat_long_point_one.split(",")[1]),
        },
        {
          lat: parseFloat(this.area.lat_long_point_two.split(",")[0]),
          lng: parseFloat(this.area.lat_long_point_two.split(",")[1]),
        },
        {
          lat: parseFloat(this.area.lat_long_point_three.split(",")[0]),
          lng: parseFloat(this.area.lat_long_point_three.split(",")[1]),
        },
        {
          lat: parseFloat(this.area.lat_long_point_four.split(",")[0]),
          lng: parseFloat(this.area.lat_long_point_four.split(",")[1]),
        },
      ];
    },
  },
  created: async function() {
    if (!this.area) {
      const response = await this.$store.dispatch("getArea", this._id);

      if (response.status === STATUS.SUCCESS) {
        this.name = response.data.name;
        this.description = response.data.description;
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    } else {
      console.log("parsing coords");
      this.parseCoordinates();
      console.log(this.coordinates);
    }
  },
};
</script>

<style scoped>
.card {
  max-width: 800px;
}
</style>
