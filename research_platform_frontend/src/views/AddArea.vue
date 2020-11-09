<template>
  <v-container class="pa-8">
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="name" label="Name" required></v-text-field>
      </v-col>
      <v-col cols="12">
        <AreaMap />
      </v-col>
      <v-col cols="12">
        <v-btn color="primary">Add Area</v-btn>
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
