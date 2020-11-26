<template>
  <v-layout class="d-flex column">
    <v-btn @click="selectInputFolder" color="primary">
      {{ inputFolder || "Select input folder" }}
    </v-btn>
    <v-btn @click="selectOutputFolder" color="primary">
      {{ outputFolder || "Select output folder" }}
    </v-btn>
    <v-btn color="primary">Test the detection script</v-btn>
  </v-layout>
</template>

<script>
import { FILESYSTEM, SELECT_FOLDER } from '../../../data-preperation-app/dist_electron/bundled/backend_dist/api/matplotlib/mpl-data/src/constants';
export default {
  name: "Test",
  data: () => ({
    inputFolder:
      "C:\\Users\\sueno\\Documents\\Flower power flow test\\Original annotated data",
    outputFolder: "C:\\Users\\sueno\\Desktop\\splitted data!",
  }),
  methods: {
    async selectInputFolder() {
      const response = await window.electron.invoke(FILESYSTEM, SELECT_FOLDER);

      this.inputFolder = response;
    },
    async selectOutputFolder() {
      const response = await window.electron.invoke(FILESYSTEM, SELECT_FOLDER);

      this.outputFolder = response;
    },
  },
};
</script>
