<template>
  <div>
    <p class="subtitle-2 text-center">Process instellingen</p>
    <p v-if="process_disabled">
      Deze instellingen hoeven niet ingevuld te worden op het moment dat er geen
      gebruik word gemaakt van FTP.
    </p>
    <v-select
      :disabled="process_disabled"
      v-model="selectedModel"
      :items="models.models"
      item-text="name"
      item-value="_id"
      label="Select"
      persistent-hint
      return-object
      single-line
    ></v-select>
    <small
      ><a
        href="#"
        :class="process_disabled == true ? 'disabled' : ''"
        @click="downloadWeight"
        >Download laatste gewicht voor
        {{ selectedModel && selectedModel.type }}</a
      ></small
    >
    <v-progress-linear
      v-if="downloading"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-select
      :disabled="process_disabled"
      v-model="selected_ai_weight"
      :items="ai_available_weights"
      item-text="weight"
      item-value="weight"
      label="Select"
      persistent-hint
      return-object
      single-line
    ></v-select>

    <br />
    <br />

    <p class="subtitle-2 text-center">Detectie instellingen</p>

    <v-text-field
      :disabled="process_disabled"
      append-icon="mdi-image-size-select-small"
      label="Detectie afbeelding grote (px)"
      type="number"
      hint="Standaard: 640 pixels"
      v-model="process_settings.image_width"
    ></v-text-field>
    <br />
    <v-slider
      :disabled="process_disabled"
      :hint="process_settings.confidence + '%'"
      max="100"
      min="5"
      :thumb-size="24"
      thumb-label="always"
      persistent-hint
      v-model="process_settings.confidence"
    >
      <template v-slot:thumb-label="{ value }">
        {{ satisfactionEmojis[Math.min(Math.floor(value / 10), 9)] }}
      </template>
    </v-slider>
    <p>
      De confidence van de AI houd in hoe goed hij het object moet herkennen om
      het object mee te rekenen in het systeem, een confidence tussen de 20 en
      40 is aan te raden.
    </p>
    <br />
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as axios from "axios";
import { DOWNLOAD } from "../../constants";

export default {
  name: "CreateProcessSettings",
  props: {
    process_disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    process_settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedModel: null,
      // ai_types: [
      //   { type: "YoloV5" },
      //   { type: "YoloV3" },
      //   { type: "F-RCNN" },
      //   { type: "Detectron2" },
      // ],
      selected_ai_weight: { weight: "SomeWeight 1", weight_type: "YoloV5" },
      ai_weights: [
        { weight: "SomeWeight 1", weight_type: "YoloV5" },
        { weight: "SomeWeight 2", weight_type: "YoloV5" },
        { weight: "SomeWeight 3", weight_type: "YoloV3" },
        { weight: "SomeWeight 4", weight_type: "YoloV3" },
        { weight: "SomeWeight 5", weight_type: "F-RCNN" },
        { weight: "SomeWeight 5", weight_type: "F-RCNN" },
        { weight: "SomeWeight 5", weight_type: "Detectron2" },
        { weight: "SomeWeight 5", weight_type: "Detectron2" },
      ],
      satisfactionEmojis: [
        "☹️",
        "🙂",
        "😊",
        "😊",
        "🙂",
        "🙂",
        "🙂",
        "😐",
        "😐",
        "☹️",
      ],
      downloading: false,
    };
  },
  computed: {
    ai_available_weights: function() {
      return this.ai_weights.filter((w) => {
        return w.weight_type === "YoloV5"; //THIS WON'T WORK YET this.selectedModel.type;
      });
    },
    ...mapState(["models"]),
  },
  watch: {
    selectedModel: function(ai_type) {
      this.process_settings.model = ai_type.type;
    },
    selected_ai_weight: function(ai_weight) {
      this.process_settings.weight = ai_weight.weight;
    },
  },
  methods: {
    downloadWeight() {
      this.downloading = true;
      //TODO CHANGE HARDCODED DIRECTORY TO THE DIRECTORY WHERE WE WANT TO SAVE THE WEIGHTS
      window.electron.send(DOWNLOAD, {
        url:
          "http://localhost:7080/" +
          this.selectedModel.weights[0].filePath.split(/\/(.+)/)[1],
        properties: { directory: "C:\\Users\\sueno\\Documents\\baboo" },
      });
    },
  },
};
</script>

<style lang="css" scoped>
.disabled {
  color: grey;
  cursor: not-allowed;
}
</style>
