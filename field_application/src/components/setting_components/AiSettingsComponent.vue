<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <p class="subtitle-2 text-left">Modellen downloaden</p>
                    <v-btn
                        color="primary"
                        class="mb-4"
                        @click="downloadModels()"
                        >Downloaden</v-btn
                    >
                    <v-progress-linear
                        v-if="downloading"
                        indeterminate
                        color="primary"
                    ></v-progress-linear>
                </v-col>
                <v-col cols="12" sm="12">
                    <p class="subtitle-2 text-left">Gewichten</p>
                    <v-text-field
                        v-model="searchWeights"
                        append-icon="mdi-magnify"
                        label="Zoeken"
                        single-line
                        hide-details
                        class="mb-2"
                    ></v-text-field>
                    <v-data-table
                        :headers="headers"
                        :items="computed_weights"
                        item-key="_id"
                        sort-by="name"
                        group-by="model"
                        class="elevation-1"
                        show-group-by
                        hide-default-footer
                    >
                        <template v-slot:item.controls="props">
                            <v-btn
                                v-if="!props.item.downloadPath"
                                class="mx-2"
                                small
                                color="success"
                                @click="downloadWeight(props.item)"
                            >
                                Downloaden
                            </v-btn>
                            <v-btn
                                v-if="props.item.downloadPath"
                                class="mx-2"
                                small
                                color="error"
                                @click="removeWeight(props.item)"
                            >
                                Verwijderen
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="12 mt-10" sm="12">
                    <p class="subtitle-2 text-left">
                        Modellen database resetten
                    </p>
                    <v-btn color="error" class="mb-4" @click="resetDatabase()"
                        >Reset database</v-btn
                    >
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { AIModelsApi } from "../../api";
import { AIModelActions } from "../../actions";
import store from "../../store";

export default {
    data() {
        return {
            searchWeights: "",
            downloading: false,
            models: [],
            headers: [
                {
                    text: "Modellen",
                    align: "start",
                    value: "name",
                    groupable: false,
                },
                { text: "Grote", value: "fileSize", groupable: false },
                {
                    text: "Gedownload",
                    value: "controls",
                    groupable: false,
                    sortable: false,
                },
                { text: "model", value: "model", align: "right" },
            ],
            weights: [],
        };
    },
    computed: {
        computed_weights() {
            var weights = [];
            this.models.forEach((model) => {
                for (let i = 0; i < model.weights.length; i++) {
                    if (
                        model.weights[i].fileName
                            .toLowerCase()
                            .includes(this.searchWeights.toLowerCase()) ||
                        model.name
                            .toLowerCase()
                            .includes(this.searchWeights.toLowerCase())
                    ) {
                        const weight = {
                            name: model.weights[i].fileName,
                            model: model.name,
                            filePath: model.weights[i].filePath,
                            fileSize: this.bytesToSize(
                                model.weights[i].fileSize
                            ),
                            model_id: model._id,
                            weight_id: model.weights[i]._id,
                            downloadPath: model.weights[i].downloadPath
                                ? model.weights[i].downloadPath
                                : null,
                        };
                        weights.push(weight);
                    }
                }
            });
            return weights;
        },
    },
    async mounted() {
        this.models = await AIModelActions.getModels();
    },
    methods: {
        bytesToSize(bytes) {
            var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            if (bytes == 0) return "0 Byte";
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
        },
        downloadModels() {
            this.downloading = true;
            AIModelsApi.getModels()
                .then(async (data) => {
                    await AIModelActions.saveModels(data);
                    this.models = await AIModelActions.getModels();
                    this.downloading = false;
                })
                .catch((err) => {
                    console.log("err", err);
                });
        },
        async removeWeight(weight) {
            await AIModelActions.removeWeight(weight);
            this.models = await AIModelActions.getModels();
            store.dispatch("alert", {
                alert_text: `${weight.name} gewicht verwijderd voor ${weight.model} model`,
            });
        },
        async downloadWeight(weight) {
            const newPath = await AIModelActions.downloadWeight(weight);
            this.models = await AIModelActions.getModels();
            store.dispatch("alert", {
                alert_text: `${weight.name} gewicht gedownload voor ${weight.model} model`,
            });
        },
        async resetDatabase() {
            if (
                confirm(
                    "Weet je zeker dat je de lokale database wilt resetten?"
                )
            ) {
                await AIModelActions.resetModels();
                this.models = await AIModelActions.getModels();
            }
        },
    },
};
</script>

<style lang="css" scoped>
</style>
