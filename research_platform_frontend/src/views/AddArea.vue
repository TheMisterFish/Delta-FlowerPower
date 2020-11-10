<template>
  <v-container fill-height fluid class="pa-8 align-start">
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
              label="Description"
              auto-grow
              background-color="white"
            >
            </v-textarea>
          </v-col>

          <v-col cols="3">
            <v-btn color="primary">Add Area</v-btn>
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
  }),
};
</script>
