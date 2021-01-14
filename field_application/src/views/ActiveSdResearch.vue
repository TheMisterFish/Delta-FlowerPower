<template>
  <div>
    <v-btn class="ma-4" to="/">Terug</v-btn>
    <detect-component :addResult="addResult"></detect-component>
    <v-btn class="ma-4" @click="saveResults">Opslaan</v-btn>
  </div>
</template>

<script>
import DetectComponent from "@/components/research_settings_components/DetectComponent.vue";
import { SessionsActions } from "../actions";
import { IPC_CHANNELS, IPC_MESSAGES } from "../constants";
import * as axios from "axios";
import { IpcMessage } from "../IpcMessage";

export default {
  components: {
    DetectComponent,
  },
  data: () => ({
    session: null,
    results: null,
    images: [],
  }),
  methods: {
    async saveResults() {
      const data = new FormData();

      const ipcMessage = new IpcMessage(
        IPC_MESSAGES.DOWNLOAD_IMAGES_FROM_FOLDER,
        this.session.images_path
      );

      const images = await window.electron.invoke(
        IPC_CHANNELS.FILESYSTEM,
        ipcMessage
      );

      images.forEach((i) => {
        const image = new Blob([i.data]);
        data.append("files", image, i.name);
      });

      console.log(this.session.process_settings.confidence);

      data.append("research", this.session.research._id);
      data.append("aimodel", this.session.process_settings.model._id);
      data.append("weights", this.session.process_settings.weights._id);
      data.append("confidence", this.session.process_settings.confidence);
      data.append("session_type", this.session.session_type);
      data.append("results", JSON.stringify(this.results));

      console.log(this.session);

      const response = await axios.post("/sessions", data)

      console.log(response);
    },

    addResult(result) {
      this.images = result.map((r) => r.filePath);
      this.results = result.map((r) => ({
        boundingBoxes: r.boundingBoxes,
        file: { fileName: r.image },
      }));

      //TODO LOAD THE IMAGES IN WITH NODEJS
      //THEN SEND EVERYTHING TO NESTJS!!!!
      //PROFIT!?
    },
  },

  created: async function() {
    const sessions = await SessionsActions.getSessions();

    this.session = sessions.filter((s) => s._id === this.$route.params.id)[0];
  },
};
</script>

<style lang="css" scoped></style>
