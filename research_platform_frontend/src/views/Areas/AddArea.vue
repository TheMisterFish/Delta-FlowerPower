<template>
  <v-container class="pa-8 align-start fill-height">
    <v-row class="fill-height">
      <v-col cols="12">
        <v-card class="fill-height px-8">
          <v-row class="fill-height">
            <v-col cols="12" md="9">
              <v-row class="fill-height">
                <v-col style="min-height: 500px;" cols="12">
                  <AreaMap />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="3">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    outlined
                    v-model="name"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    outlined
                    v-model="description"
                    label="Description"
                    auto-grow
                  >
                  </v-textarea>
                </v-col>

                <v-col cols="3">
                  <v-btn @click="addArea" color="primary">Add Area</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
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
  }),
  methods: {
    async addArea() {
      const name = this.name;
      const description = this.description;

      //For now this is hardcoded but we are going to fix this!
      const lat_long_point_one = "5.469722, 51.441643";
      const lat_long_point_two = "5.469722, 51.441643";

      const response = await this.$store.dispatch("addArea", {
        name: name,
        description: description,
        lat_long_point_one: lat_long_point_one,
        lat_long_point_two: lat_long_point_two,
      });

      if (response.status === STATUS.SUCCESS) {
        this.$router.push({ name: "areas" });
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    },
  },
};
</script>
