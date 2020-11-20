<template>
  <v-container>
    <v-btn @click="selectFiles" color="primary">
      Open images
    </v-btn>
  </v-container>
</template>

<script>
import { FILESYSTEM } from "../constants.js";
export default {
  name: "landing",
  methods: {
    selectFiles() {
      window.electron.send(FILESYSTEM, "Please open");
    },
  },
};
</script>
