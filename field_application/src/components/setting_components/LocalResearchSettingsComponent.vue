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
                                >{{ researches.length }}</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title
                                >Drone onderzoeken</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >{{ drone_research_count }}</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title
                                >SD onderzoeken</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >{{ sd_research_count }}</v-list-item-subtitle
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
import { ResearchDatabaseActions } from "../../actions";
export default {
    data() {
        return {
            searchResearches: null,
            downloading: false,
            researches: [],
        };
    },
    computed: {
        drone_research_count: function () {
            return this.researches.filter(
                (obj) => obj.research_type === "drone"
            ).length;
        },
        sd_research_count: function () {
            return this.researches.filter(
                (obj) => obj.research_type === "sd"
            ).length;
        },
    },
    async mounted() {
        this.researches = await ResearchDatabaseActions.getResearches();
        console.log("R:", this.researches);
    },
    methods: {
        async resetDatabase() {
            if (
                confirm(
                    "Weet je zeker dat je de lokale database wilt resetten?"
                )
            ) {
                await ResearchDatabaseActions.resetResearches();
            }
        },
    },
};
</script>

<style lang="css" scoped>
</style>
