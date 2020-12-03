<template>
    <div>
        <p class="subtitle-2 text-center">Onderzoek instellingen</p>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Zoeken"
            single-line
            hide-details
        ></v-text-field>

        <small
            ><a href="#" @click="downloadResearches"
                >Download onderzoeken</a
            ></small
        >
        <small
            ><a href="#" @click="downloadLocations">Download locaties</a></small
        >
        <v-progress-linear
            v-if="downloading"
            indeterminate
            color="primary"
        ></v-progress-linear>

        <div class="scroll-box">
            <v-list two-line>
                <v-list-item-group
                    v-model="selected"
                    active-class="primary--text"
                    single
                >
                    <template
                        v-for="(research, index) in researches.researches"
                    >
                        <v-list-item :key="research._id">
                            <template>
                                <v-list-item-content>
                                    <v-list-item-title
                                        v-text="research.name"
                                    ></v-list-item-title>

                                    <!-- <v-list-item-subtitle
                                                                                class="text--primary"
                                                                                v-text="research.name"
                                                                        ></v-list-item-subtitle> -->

                                    <v-list-item-subtitle
                                        v-text="research.description"
                                    ></v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-list-item-action-text>
                                        {{ item.made_by.name }}
                                    </v-list-item-action-text>
                                    <v-list-item-action-text>
                                        {{ item.created_at | dateTime }}
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
            </v-list>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
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
        };
    },
    computed: {
        filtered_items: function () {
            return this.items.filter((i) => {
                return i.name.toLowerCase().includes(this.search.toLowerCase());
            });
        },
        ...mapState(["researches"]),
    },
    methods: {
        downloadResearches() {
            this.downloading = true;
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
