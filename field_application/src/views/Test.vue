<template>
  <v-layout class="d-flex column">
    <v-btn @click="selectWeightsFile" color="primary">
      {{ weightsFile || "Select output folder" }}
    </v-btn>
    <v-btn @click="selectInputFolder" color="primary">
      {{ inputFolder || "Select input folder" }}
    </v-btn>
    <v-btn @click="selectOutputFolder" color="primary">
      {{ outputFolder || "Select output folder" }}
    </v-btn>
    <v-btn @click="detectImages" color="primary"
      >Test the detection script</v-btn
    >
    <h1>{{ socket.messages[socket.messages.length - 1] }}</h1>
  </v-layout>
</template>

<script>
import { FILESYSTEM, SELECT_FOLDER, DETECT_IMAGES } from "../constants.js";
import { mapState } from "vuex";
export default {
  name: "Test",
  data: () => ({
    weightsFile: "C:\\Users\\sueno\\Desktop\\weights\\best_weights.pt",
    inputFolder:
      "C:\\Users\\sueno\\Documents\\Flower power flow test\\Splitted data\\images",
    outputFolder: "C:\\Users\\sueno\\Desktop\\splitted data!",
  }),
  computed: {
    ...mapState(["socket"]),
  },
  methods: {
    async selectWeightsFile() {

    },

    async selectInputFolder() {
      const response = await window.electron.invoke(FILESYSTEM, SELECT_FOLDER);

      this.inputFolder = response;
    },
    async selectOutputFolder() {
      const response = await window.electron.invoke(FILESYSTEM, SELECT_FOLDER);

      this.outputFolder = response;
    },

    detectImages() {
      this.$store.dispatch(
        "sendWebSocketMessage",
        JSON.stringify([DETECT_IMAGES, this.weightsFile, this.inputFolder, this.outputFolder])
      );
    },
  },
};
</script>
