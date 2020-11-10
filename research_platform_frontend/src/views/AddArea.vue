<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row style="height: 100%;">
      <v-col cols="12" md="9">
        <v-row style="height: 100%;">
          <v-col style="min-height: 400px;" cols="12">
            <AreaMap />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3">
        <v-row>
          <v-col cols="12">
            <v-text-field
              background-color="white"
              filled
              v-model="name"
              label="Name"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              filled
              v-model="description"
              label="Description"
              auto-grow
              background-color="white"
            >
            </v-textarea>
          </v-col>

          <v-col cols="3">
            <v-btn @click="addArea" color="primary">Add Area</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AreaMap from "../components/AreaMap.vue";

export default {
  name: "AddArea",
  components: {
    AreaMap,
  },
  data: () => ({
    name: "",
    description: "",
  }),
  methods: {
    addArea() {
      const name = this.name;
      const description = this.description;

      //For now this is hardcoded but we are going to fix this!
      const lat_long_point_one = "5.469722, 51.441643";
      const lat_long_point_two = "5.469722, 51.441643";

      this.$store
        .dispatch("addArea", {
          name: name,
          description: description,
          lat_long_point_one: lat_long_point_one,
          lat_long_point_two: lat_long_point_two,
        })
        .then(() => {
          console.log("added area!");
          this.$router.push({name: "areas"});
        })
        .catch((error) => {
          console.log("error :-(", error);
        });
    },
  },
};
</script>
