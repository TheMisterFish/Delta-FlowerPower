<template>
  <v-layout class="d-flex column wrap">
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
    <h1 v-if="messages">{{ messages[messages.length - 1] }}</h1>

    <v-row>
      <v-col v-for="(image, index) in images" :key="index" cols="4">
        <AnnotatedImage
          :imagePath="image.filePath"
          :boundingBoxes="image.boundingBoxes"
        />
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { FILESYSTEM, IPC_MESSAGES, DETECT_IMAGES } from "../constants.js";
import { IpcMessage } from "../IpcMessage.js";
import { mapState } from "vuex";
import AnnotatedImage from "../components/AnnotatedImage.vue";
export default {
  name: "Test",
  components: {
    AnnotatedImage,
  },
  data: () => ({
    weightsFile: "C:\\Users\\sueno\\Desktop\\weights\\best_weights.pt",
    inputFolder: "C:\\Users\\sueno\\Desktop\\spliet",
    outputFolder: "C:\\Users\\sueno\\Desktop\\splitted data!",
    images: [],
  }),
  computed: {
    ...mapState({
      messages: (state) => state.socket.messages,
    }),
  },
  watch: {
    messages(newValue, oldValue) {
      const message = JSON.parse(newValue[newValue.length - 1]);
      if (message.message === "BOUNDING_BOXES") {
        const image = message.data.image;
        const boundingBoxes = message.data.boundingBoxes;
        this.images.forEach((i) => {
          if (i.filePath === image) {
            i.boundingBoxes = boundingBoxes;
          }
        });
      }
    },
  },
  methods: {
    async selectWeightsFile() {},

    async selectInputFolder() {
      const ipcMessage = new IpcMessage(IPC_MESSAGES.SELECT_FOLDER);
      const response = await window.electron.invoke(FILESYSTEM, ipcMessage);

      this.inputFolder = response;

      this.getImagesFromFolder(response);
    },

    async getImagesFromFolder(folder) {
      const ipcMessage = new IpcMessage(
        IPC_MESSAGES.GET_IMAGE_FILES_FROM_FOLDER,
        folder
      );
      const response = await window.electron.invoke(FILESYSTEM, ipcMessage);

      response.forEach((r) => {
        this.images.push({
          image: r,
          filePath: `${this.inputFolder}\\${r}`,
          boundingBoxes: [],
        });
      });
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
    beforeDestroy() {
      this.unwatch();
    },
  },
};
</script>
