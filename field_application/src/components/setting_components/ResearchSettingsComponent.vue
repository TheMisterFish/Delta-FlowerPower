<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <p class="subtitle-2 text-left">Onderzoeken downloaden</p>
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
                    <p class="subtitle-2 text-left">Onderzoeken</p>
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
                                    <th class="text-left">Onderzoek naam</th>
                                    <th class="text-left">Locatie</th>
                                    <th class="text-right">Verwijder</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(research, index) in researches"
                                    :key="index"
                                >
                                    <td>{{ research.name }} </td>
                                    <td>{{ research.location_id.name }}</td>
                                    <td class="text-right">
                                        <v-btn color="error" small @click="remove(research._id)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                            <div class="ma-3" v-if="researches.length == 0">
                                Geen researches gevonden...
                            </div>
                        </template>
                    </v-simple-table>
                </v-col>
                <v-col cols="12 mt-10" sm="12">
                    <p class="subtitle-2 text-left">Onderzoeken database resetten</p>
                    <v-btn
                        color="error"
                        class="mb-4"
                        @click="resetDatabase()"
                        >Reset database</v-btn
                    >
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { ResearchesApi } from "../../api";
import { ApiDatabaseActions } from "../../actions";
export default {
    data() {
        return {
            searchResearches: null,
            downloading: false,
            researches: [],
        };
    },
    async mounted() {
        this.researches = await ApiDatabaseActions.getResearches();
    },
    methods: {
        downloadResearches() {
            this.downloading = true;
            ResearchesApi.getResearches()
                .then(async (data) => {
                    await ApiDatabaseActions.saveResearches(data);
                    this.researches = await ApiDatabaseActions.getResearches();
                    this.downloading = false;
                })
                .catch((err) => {
                    console.log("err", err);
                });
        },
        async remove(_id){
            ApiDatabaseActions.removeResearch(_id);
            this.researches = await ApiDatabaseActions.getResearches();
        },
        async resetDatabase(){
            if(confirm("Weet je zeker dat je de lokale database wilt resetten?")){
                await ApiDatabaseActions.resetApiResearches();
            }
        }
    },
};
</script>

<style lang="css" scoped>
</style>
