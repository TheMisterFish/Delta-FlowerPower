<template>
    <div>
        <p class="subtitle-2 text-center" @click="showCustom = true">
            Onderzoek instellingen
        </p>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Zoeken"
            single-line
            hide-details
        ></v-text-field>
        <br />
        <div v-if="showCustom">
            <v-text-field
                v-model="research_settings.research.location.lat_long_point_one"
                append-icon="mdi-eart"
                label="Lat 1"
                single-line
                hide-details
            ></v-text-field>
            <v-text-field
                v-model="research_settings.pos_y_1"
                append-icon="mdi-eart"
                label="Lon 1"
                single-line
                hide-details
            ></v-text-field>
            <br />
            <v-text-field
                v-model="research_settings.pos_x_2"
                append-icon="mdi-eart"
                label="Lat 2"
                single-line
                hide-details
            ></v-text-field>
            <v-text-field
                v-model="research_settings.pos_y_2"
                append-icon="mdi-eart"
                label="Lon 2"
                single-line
                hide-details
            ></v-text-field>
        </div>
        <br />
        <small>
            <a href="#" @click="downloadResearches">Download onderzoeken</a>
        </small>

        <v-progress-linear
            v-if="downloading"
            indeterminate
            color="primary"
        ></v-progress-linear>

        <div class="scroll-box">
            <v-list two-line>
                <v-list-item-group
                    v-if="
                        researches &&
                        researches.length > 0
                    "
                    v-model="selected"
                    active-class="primary--text"
                    single
                >
                    <template
                        v-for="(research, index) in researches"
                    >
                        <v-list-item
                            @click="selectResearch(research)"
                            :key="research._id"
                        >
                            <template>
                                <v-list-item-content>
                                    <v-list-item-title
                                        v-text="research.name"
                                    ></v-list-item-title>
                                    <v-list-item-subtitle
                                        v-text="research.description"
                                    ></v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-list-item-action-text>
                                        {{ research.made_by.name }}
                                    </v-list-item-action-text>
                                    <v-list-item-action-text>
                                        {{ research.created_at | dateTime }}
                                    </v-list-item-action-text>
                                </v-list-item-action>
                            </template>
                        </v-list-item>

                        <v-divider
                            v-if="index < researches.length - 1"
                            :key="index"
                        ></v-divider>
                    </template>
                </v-list-item-group>
                <p
                    v-if="
                        !researches ||
                        researches.length == 0
                    "
                >
                    Geen onderzoeken gedownload.
                </p>
            </v-list>
        </div>
    </div>
</template>

<script>
import { mdiEarth } from "@mdi/js";
import { ResearchDatabaseActions } from "../../actions";
import { ResearchesApi } from "../../api";

export default {
    name: "SelectResearchSettings",
    props: {
        research_settings: {
            type: Object,
            required: true,
        },
    },
    filters: {
        dateTime: function (thing) {
            return window.moment().format("LLL");
        },
    },
    data() {
        return {
            downloading: false,
            search: "",
            selected: 2,
            showCustom: false,
            researches: [],
        };
    },
    computed: {
        filtered_items: function () {
            return this.researches.filter((r) => {
                return r.name.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    async mounted() {
        this.researches = await ResearchDatabaseActions.getResearches();
    },
    methods: {
        downloadResearches() {
            this.downloading = true;
            ResearchesApi.getResearches()
                .then(async (data) => {
                    await ResearchDatabaseActions.saveResearches(data);
                    this.researches = await ResearchDatabaseActions.getResearches();
                    this.downloading = false;
                })
                .catch((err) => {
                    console.log("err", err);
                    this.downloading = false;
                });
        },
        selectResearch(research) {
            this.research_settings.research = research
        },
    },
};
</script>

<style lang="css" scoped>
.scroll-box {
    height: 480px;
    overflow-y: scroll;
}
</style>
