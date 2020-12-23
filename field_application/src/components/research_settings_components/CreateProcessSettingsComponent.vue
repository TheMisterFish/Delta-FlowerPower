<template>
    <div>
        <p class="subtitle-2 text-center">Process instellingen</p>
        <p v-if="process_disabled">
            Deze instellingen hoeven niet ingevuld te worden op het moment dat
            er geen gebruik word gemaakt van FTP.
        </p>
        <v-select
            :disabled="process_disabled"
            v-model="selectedModel"
            :items="models"
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
                :class="process_disabled == true ? 'disabled' : !selectedModel ? 'disabled' : ''"
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
            item-text="name"
            item-value="name"
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
            v-model="process_settings.detect_width"
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
            De confidence van de AI houd in hoe goed hij het object moet
            herkennen om het object mee te rekenen in het systeem, een
            confidence tussen de 20 en 40 is aan te raden.
        </p>
        <br />
    </div>
</template>

<script>
import * as axios from "axios";
import { IPC_CHANNELS } from "../../constants";

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
            selected_ai_weight: null,
            ai_weights: [],
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
            models: ["YoloV5"]
        };
    },
    computed: {
        ai_available_weights: function () {
            if(!this.selectedModel) return [];
            
            return this.ai_weights.filter((w) => {
                return w.modelName.toLowerCase() === "yolov5";
            });
        },
    },
    watch: {
        selectedModel: async function (ai_type) {
            await this.getLocalWeights(ai_type)
            this.process_settings.model = ai_type;
        },
        selected_ai_weight: function (ai_weight) {
            this.process_settings.weights = {name: ai_weight.name, path: ai_weight.path};
        },
    },
    methods: {
        async downloadWeight() {   
            if(!this.selectedModel) return
            console.log(this.selectedModel);
            this.downloading = true;
            //TODO CHANGE HARDCODED DIRECTORY TO THE DIRECTORY WHERE WE WANT TO SAVE THE WEIGHTS
            const filePath = await window.electron.invoke(IPC_CHANNELS.DOWNLOAD_WEIGHTS, {
                url: `http://localhost:3000/${this.selectedModel.weights[0].filePath.split(/\/(.+)/)[1]}`,
                modelName: this.process_settings.model
            });
            console.log(filePath);
            this.getLocalWeights(this.process_settings.model)
            this.downloading = false;
        },

        async getLocalWeights(modelName) {
            const weights = await window.electron.invoke(IPC_CHANNELS.GET_WEIGHTS_FROM_FOLDER, {
                modelName: modelName
            })
            console.log(weights);
            console.log(this.ai_weights);
            this.ai_weights = (weights !== undefined) ? weights : [];
            console.log(this.ai_weights);
        }
    },
};
</script>

<style lang="css" scoped>
.disabled {
    color: grey;
    cursor: not-allowed;
}
</style>
