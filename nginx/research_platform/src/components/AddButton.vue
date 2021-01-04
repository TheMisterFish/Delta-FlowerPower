<template>
  <v-btn
    :to="{ name: to }"
    bottom
    fixed
    right
    color="primary"
    elevation="2"
    fab
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "AddButton",
  props: ["to"],
};
</script>
