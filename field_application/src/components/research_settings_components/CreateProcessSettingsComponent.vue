<template>
    <div>
        <p class="subtitle-2 text-center">Process instellingen</p>
        <p v-if="process_disabled">
            Deze instellingen hoeven niet ingevuld te worden op het moment dat
            er geen gebruik word gemaakt van FTP.
        </p>
        <small
            ><a
                href="#"
                :class="process_disabled == true ? 'disabled' : ''"
                @click="downloadModels"
                >Download alle modellen
            </a></small
        >
        <v-progress-linear
            v-if="downloading_models"
            indeterminate
            color="primary"
        ></v-progress-linear>
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
                :class="
                    process_disabled == true
                        ? 'disabled'
                        : !selectedModel
                        ? 'disabled'
                        : ''
                "
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
import { AIModelActions } from "../../actions";
import { AIModelsApi } from "../../api";

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
            downloading_models: false,
            models: [],
        };
    },
    computed: {
        ai_available_weights: function () {
            if (!this.selectedModel) return [];
            const aiModels = [];
            for (let i = 0; i < this.selectedModel.weights.length; i++) {
                if (this.selectedModel.weights[i].downloadPath) {
                    const element = {
                        name: this.selectedModel.weights[i].fileName,
                        path: this.selectedModel.weights[i].downloadPath,
                    };
                    aiModels.push(element);
                }
            }
            return aiModels;
        },
    },
    watch: {
        selectedModel: async function (ai_type) {
            this.process_settings.model = ai_type;
            this.ai_weights = ai_type.weights;
        },
        selected_ai_weight: function (ai_weight) {
            this.process_settings.weights = {
                name: ai_weight.name,
                path: ai_weight.path,
            };
        },
    },
    mounted() {
        this.getLocalModels();
    },
    methods: {
        async downloadWeight() {
            if (!this.selectedModel) return;
            this.downloading = true;

            const weight = {
                name: this.selectedModel.weights[
                    this.selectedModel.weights.length - 1
                ].fileName,
                model: this.selectedModel.name,
                filePath: this.selectedModel.weights[
                    this.selectedModel.weights.length - 1
                ].filePath,
                model_id: this.selectedModel._id,
                weight_id: this.selectedModel.weights[
                    this.selectedModel.weights.length - 1
                ]._id,
            };
            const newPath = await AIModelActions.downloadWeight(weight);
            this.models = await AIModelActions.getModels();
            this.selectedModel = this.models.find(
                (x) => x._id === this.selectedModel._id
            );
            this.downloading = false;
        },
        async getLocalModels() {
            const models = await AIModelActions.getModels();
            this.models = models !== undefined ? models : [];
        },
        async downloadModels() {
            this.downloading_models = true;
            AIModelsApi.getModels()
                .then(async (data) => {
                    await AIModelActions.saveModels(data);
                    this.models = await AIModelActions.getModels();
                    this.downloading_models = false;
                })
                .catch((err) => {
                    console.log("err", err);
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
