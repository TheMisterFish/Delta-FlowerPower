<template>
  <v-container>
    <v-btn @click="selectInputFolder" color="primary">
      {{ inputFolder || "Select input folder" }}
    </v-btn>
    <v-btn @click="selectOutputFolder" color="primary">
      {{ outputFolder || "Select output folder" }}
    </v-btn>
    {{ socket.messages[socket.messages.length - 1] }}
    <v-btn @click="splitImages" color="primary">
      Split images
    </v-btn>
  </v-container>
</template>

<script>
import { FILESYSTEM, SELECT_FOLDER, SPLIT_IMAGES } from "../constants.js";
import { mapState } from "vuex";

export default {
  name: "landing",
  data: () => ({
    inputFolder:
      "C:\\Users\\sueno\\Documents\\Flower power flow test\\Original annotated data",
    outputFolder: "C:\\Users\\sueno\\Desktop\\splitted data!",
  }),
  computed: {
    ...mapState(["socket"]),
  },
  methods: {
    async selectInputFolder() {
      const response = await window.electron.invoke(FILESYSTEM, SELECT_FOLDER);

      this.inputFolder = response;
    },
    async selectOutputFolder() {
      const response = await window.electron.invoke(FILESYSTEM, SELECT_FOLDER);

      this.outputFolder = response;
    },
    splitImages() {
      this.$store.dispatch(
        "sendWebSocketMessage",
        JSON.stringify([SPLIT_IMAGES, this.inputFolder, this.outputFolder])
      );
    },
  },
};
</script>
