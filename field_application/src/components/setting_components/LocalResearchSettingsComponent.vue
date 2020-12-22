LocalResearchSettingsComponent
<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <p class="subtitle-2 text-left">Aantal onderzoeken:</p>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title>Totaal</v-list-item-title>
                            <v-list-item-subtitle
                                >Secondary text</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title>Drone onderzoeken</v-list-item-title>
                            <v-list-item-subtitle
                                >Secondary text</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title>SD onderzoeken</v-list-item-title>
                            <v-list-item-subtitle
                                >Secondary text</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
                <v-col cols="12 mt-10" sm="12">
                    <p class="subtitle-2 text-left">
                        Onderzoeken database resetten
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
import { ResearchesApi } from "../../api";
import { LocalDatabaseActions } from "../../actions";
export default {
    data() {
        return {
            searchResearches: null,
            downloading: false,
            researches: [],
        };
    },
    async mounted() {
        this.researches = await LocalDatabaseActions.getLocalResearches();
        console.log(this.researches);
    },
    methods: {
        async resetDatabase() {
            if (
                confirm(
                    "Weet je zeker dat je de lokale database wilt resetten?"
                )
            ) {
                await LocalDatabaseActions.resetLocalResearches();
            }
        },
    },
};
</script>

<style lang="css" scoped>
</style>
