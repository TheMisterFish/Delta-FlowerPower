<template>
    <div id="dashboard">
        <v-container class="mb-5">
            <v-row>
                <v-col cols="12" sm="12">
                    <h3 class="text-center">Nieuw onderzoek.</h3>
                </v-col>
                <v-col cols="6" sm="6">
                    <v-btn
                        class="big-button no-text-transform text-center"
                        to="create_drone_research"
                        block
                    >
                        <span
                            style="
                                white-space: normal;
                                word-wrap: break-word;
                                width: 90%;
                                padding: 10%;
                            "
                        >
                            <v-icon color="primary" x-large
                                >mdi-quadcopter</v-icon
                            >
                            <br /><br />
                            Onderzoek met drone uitvoeren.
                        </span>
                    </v-btn>
                </v-col>
                <v-col cols="6" sm="6">
                    <v-btn
                        class="big-button no-text-transform text-center"
                        @click="selectInputFolder"
                        block
                    >
                        <span
                            style="
                                white-space: normal;
                                word-wrap: break-word;
                                width: 90%;
                                padding: 10%;
                            "
                        >
                            <v-icon color="primary" x-large
                                >mdi-micro-sd</v-icon
                            >
                            <br /><br />
                            Foto's van SD kaart gebruiken.
                        </span>
                    </v-btn>
                </v-col>
            </v-row>

            <v-divider style="padding-bottom: 10px"></v-divider>

            <v-row>
                <v-col cols="12" sm="12">
                    <h3 class="text-center">Uitgevoerde onderzoeken.</h3>
                </v-col>
                <v-col cols="12" sm="12">
                    <v-text-field
                        v-model="search_prev_research"
                        append-icon="mdi-magnify"
                        label="Zoeken"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                    <v-card
                        class="mx-auto card-spacer"
                        v-for="(research, index) in researches"
                        :key="index"
                    >
                        <div class="row">
                            <div class="col-4">
                                <v-card-text>
                                    <v-list-item two-line>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Onderzoek:</v-list-item-title
                                            >
                                            <v-list-item-subtitle>
                                                {{
                                                    research.research_settings
                                                        .research.name
                                                }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Locatie:</v-list-item-title
                                            >
                                            <v-list-item-subtitle>
                                                {{
                                                    research.research_settings
                                                        .research.location
                                                        .name
                                                }}
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle>
                                                {{
                                                    research.research_settings
                                                        .research.location
                                                        .description
                                                }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-text>
                            </div>
                            <div class="col-4">
                                <v-card-text>
                                    <v-list-item two-line>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Type
                                                onderzoek:</v-list-item-title
                                            >
                                            <v-list-item-subtitle>{{
                                                research.research_type
                                            }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item two-line>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Uitgevoerd:</v-list-item-title
                                            >
                                            <v-list-item-subtitle>{{
                                                research.executed
                                                    ? research.executed_date
                                                    : "Nee"
                                            }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-text>
                            </div>
                            <div class="col-4">
                                <v-card-text>
                                    <v-list-item two-line>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Aantal
                                                waypoints:</v-list-item-title
                                            >
                                            <v-list-item-subtitle>{{
                                                research.waypoint_settings
                                                    .points.length
                                            }}</v-list-item-subtitle>
                                        </v-list-item-content> </v-list-item
                                    ><v-list-item two-line>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Data
                                                geupload:</v-list-item-title
                                            >
                                            <v-list-item-subtitle>{{
                                                research.uploaded == true
                                                    ? (research.upload_date | dateTime)
                                                    : "Nee"
                                            }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-text>
                            </div>
                        </div>
                        <v-card-actions class="justify-space-between">
                            <v-btn text color="primary accent-4">
                                Bekijk data en opties
                            </v-btn>
                            <div class="float-right">
                                <small>Gemaakt op:</small><br>
                                {{ research.create_date | dateTime }}
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-btn class="settings_button" color="primary" fab dark to="settings">
            <v-icon>mdi-settings</v-icon>
        </v-btn>
    </div>
</template>

<script>
import Vue from "vue";
import { mdiMicroSd, mdiQuadcopter } from "@mdi/js";
import { IPC_MESSAGES, IPC_CHANNELS } from "../constants.js";
import { IpcMessage } from "../IpcMessage.js";
import { mapState } from "vuex";
import { LocalDatabaseActions } from "../actions";

export default Vue.extend({
    name: "dashboard",
    data() {
        return {
            search_prev_research: null,
            researches: [],
        };
    },
    filters: {
        dateTime: function (time) {
            return window.moment(time).format("LLL");
        },
    },
    async mounted() {
        this.researches = await LocalDatabaseActions.getLocalResearches();
    },
    methods: {
        async selectInputFolder() {
            const ipcMessage = new IpcMessage(IPC_MESSAGES.SELECT_FOLDER);
            const response = await window.electron.invoke(
                IPC_CHANNELS.FILESYSTEM,
                ipcMessage
            );

            if (response !== undefined) {
                this.$store.dispatch("setPath", response);
                this.$router.push("/create_sd_research");
            }
        },
    },
});
</script>

<style lang="css">
.big-button {
    width: 100%;
    height: 100%;
    min-height: 150px;
    min-width: 200px;
}

.card-spacer {
    margin-bottom: 20px;
}

.v-btn__content {
    width: 100%;
}
.settings_button {
    position: fixed;
    bottom: 10px;
    right: 10px;
}
</style>
