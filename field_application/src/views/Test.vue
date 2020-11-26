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

    <div v-for="(image, index) in images" :key="index">
      {{ image }}
    </div>

    <v-img
      v-for="image in images"
      :key="image"
      :src="inputFolder + '/'+ image"
    ></v-img>
  </v-layout>
</template>

<script>
import { FILESYSTEM, IPC_MESSAGES, DETECT_IMAGES } from "../constants.js";
import { IpcMessage } from "../IpcMessage.js";
import { mapState } from "vuex";
export default {
  name: "Test",
  data: () => ({
    weightsFile: "C:\\Users\\sueno\\Desktop\\weights\\best_weights.pt",
    inputFolder:
      "C:\\Users\\sueno\\Documents\\Flower power flow test\\Splitted data\\images",
    outputFolder: "C:\\Users\\sueno\\Desktop\\splitted data!",
    images: [],
  }),
  computed: {
    ...mapState(["socket"]),
  },
  methods: {
    async selectWeightsFile() {},

    async selectInputFolder() {
      const ipcMessage = new IpcMessage(IPC_MESSAGES.SELECT_FOLDER);
      const response = await window.electron.invoke(FILESYSTEM, ipcMessage);

      this.inputFolder = response;

      console.log(response)

      this.getImagesFromFolder(response);
    },

    async getImagesFromFolder(folder) {
      const ipcMessage = new IpcMessage(
        IPC_MESSAGES.GET_IMAGE_FILES_FROM_FOLDER,
        folder
      );
      const response = await window.electron.invoke(FILESYSTEM, ipcMessage);

      this.images = response;
    },

    async selectOutputFolder() {
      const ipcMessage = new IpcMessage(IPC_MESSAGES.SELECT_FOLDER);
      const response = await window.electron.invoke(FILESYSTEM, ipcMessage);

      this.outputFolder = response;
    },

    detectImages() {
      this.$store.dispatch(
        "sendWebSocketMessage",
        JSON.stringify([
          DETECT_IMAGES,
          this.weightsFile,
          this.inputFolder,
          this.outputFolder,
        ])
      );
    },
  },
};
</script>
