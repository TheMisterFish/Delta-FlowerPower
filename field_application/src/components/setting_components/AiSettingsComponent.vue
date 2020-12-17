<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <p class="subtitle-2 text-left">Gewichten downloaden</p>
                    <v-btn
                        color="primary"
                        class="mb-4"
                        @click="downloadResearches()"
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
                        v-model="searchResearches"
                        append-icon="mdi-magnify"
                        label="Zoeken"
                        single-line
                        hide-details
                        class="mb-2"
                    ></v-text-field>
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">Gewicht naam</th>
                                    <th class="text-left">Door</th>
                                    <th class="text-right">Verwijder</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(weight, index) in weights"
                                    :key="index"
                                >
                                    <td>{{ weight.name }} </td>
                                    <td>{{ weight }}</td>
                                    <td class="text-right">
                                        <v-btn color="error" small @click="remove(weight._id)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                            <div class="ma-3" v-if="weight.length == 0">
                                Geen AI model gewichten gevonden...
                            </div>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { WeightsApi } from "../../api";
import { DatabaseActions } from "../../actions";
export default {
    data() {
        return {
            searchWeights: null,
            downloading: false,
            weights: [],
        };
    },
    async mounted() {
        this.weights = await DatabaseActions.getWeights();
    },
    methods: {
        downloadWeights() {
            this.downloading = true;
            WeightsApi.getWeights()
                .then(async (data) => {
                    await DatabaseActions.saveWeights(data);
                    this.weights = await DatabaseActions.getWeights();
                    this.downloading = false;
                })
                .catch((err) => {
                    console.log("err", err);
                });
        },
        async remove(_id){
            DatabaseActions.removeWeight(_id);
            this.weights = await DatabaseActions.getWeights();
        }
    },
};
</script>

<style lang="css" scoped>
</style>
