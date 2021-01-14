<template>
  <v-container>
    <v-card max-width="600" class="fill-height mx-auto py-3">
      <v-list-item>
          <AreaMap :editable="true" :updateCoordinates="updateCoordinates" :resetAngle="resetAngle" :angle="angle" style="min-height: 500px;" />
      </v-list-item>
      <v-list-item>
        <v-slider v-model="angle" label="rotatie" max="180" min="0" thumb-label="always"></v-slider>
      </v-list-item>
      <v-list-item>
        <v-text-field
          outlined
          v-model="name"
          label="Name"
          required
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-textarea
          outlined
          v-model="description"
          label="Description"
          auto-grow
        >
        </v-textarea>
      </v-list-item>
      <v-list-item>
        <v-spacer></v-spacer>
          <v-btn @click="addArea" color="primary">Add Area</v-btn>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import AreaMap from "../../components/AreaMap.vue";
import { STATUS } from "../../store/storeResponse";

export default {
  name: "AddArea",
  components: {
    AreaMap,
  },
  data: () => ({
    name: "",
    description: "",
    angle: 0,
    coordinates: [],
  }),
  methods: {
    resetAngle() {
      this.angle = 0;
    },

    updateCoordinates(coordinates) {
      this.coordinates = {
        lat_long_point_one: `${coordinates[0].lat},${coordinates[0].lng}`,
        lat_long_point_two: `${coordinates[1].lat},${coordinates[1].lng}`,
        lat_long_point_three: `${coordinates[2].lat},${coordinates[2].lng}`,
        lat_long_point_four: `${coordinates[3].lat},${coordinates[3].lng}`
      };
    },

    async addArea() {
      const name = this.name;
      const description = this.description;

      const response = await this.$store.dispatch("addArea", {
        name: name,
        description: description,
        lat_long_point_one: this.coordinates.lat_long_point_one,
        lat_long_point_two: this.coordinates.lat_long_point_two,
        lat_long_point_three: this.coordinates.lat_long_point_three,
        lat_long_point_four: this.coordinates.lat_long_point_four,
      });

      console.log(this.coordinates);

      if (response.status === STATUS.SUCCESS) {
        this.$router.push({ name: "areas" });
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    },
  },
};
</script>
