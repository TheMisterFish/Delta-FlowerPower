    <template>
    <v-layout fill-height column ma-0>
        <v-stepper v-model="e1" style="height: 100%; min-height: 100vh">
            <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">
                    Research
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">
                    Vlieg instellingen
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    :complete="e1 > 3"
                    step="3"
                    :rules="[() => drone_settings.use_ftp]"
                >
                    Vlieg instellingen
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="4"> Process instellingen </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <select-research-settings
                        :research_settings="research_settings"
                    ></select-research-settings>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" :disabled="!research_settings.research.name" @click="e1 = 2"> Verder </v-btn>
                    <v-btn text @click="cancel()"> Anuleren </v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <create-flight-settings
                        :photo_settings="photo_settings"
                        :drone_settings="drone_settings"
                    ></create-flight-settings>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="e1 = 3"> Verder </v-btn>
                    <v-btn text @click="e1 = 1"> Terug </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <create-process-settings
                        :process_settings="process_settings"
                        :process_disabled="!drone_settings.use_ftp"
                    ></create-process-settings>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="e1 = 4"> Verder </v-btn>
                    <v-btn text @click="e1 = 2"> Terug </v-btn>
                </v-stepper-content>

                <v-stepper-content step="4">
                    <check-settings
                        :research_settings="research_settings"
                        :photo_settings="photo_settings"
                        :drone_settings="drone_settings"
                        :process_settings="process_settings"
                        :waypoint_settings="waypoint_settings"
                    ></check-settings>

                    <v-spacer></v-spacer>

                    <v-btn
                        color="primary"
                        :disabled="!settings_ready"
                        @click="start()"
                    >
                        Start
                    </v-btn>
                    <v-btn text @click="e1 = 3"> Terug </v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-layout>
</template>

    <script>
import SelectResearchSettings from "@/components/research_settings_components/SelectResearchSettingsComponent.vue";
import createFlightSettings from "@/components/research_settings_components/CreateFlightSettingsComponent.vue";
import CreateProcessSettings from "@/components/research_settings_components/CreateProcessSettingsComponent.vue";
import CheckSettings from "@/components/research_settings_components/CheckSettingsComponent.vue";
import { SessionsActions } from "@/actions";

export default {
    name: "DroneResearch",
    data() {
        return {
            e1: 1,
            research_settings: {
                research: {
                    name: null,
                    description: null,
                },
                pos_x_1: null,
                pos_y_1: null,
                pos_x_2: null,
                pos_y_2: null,
                pos_x_3: null,
                pos_y_3: null,
                pos_x_4: null,
                pos_y_4: null,
                
            },
            photo_settings: {
                sensor_width: 6.17,
                focal_length: 4.55,
                image_width: 3968,
                image_height: 2976,
            },
            drone_settings: {
                fly_height: 3,
                use_ftp: true,
                connection_url: ":14450",
            },
            process_settings: {
                model: null,
                weights: {
                    name: null,
                },
                detect_width: 640,
                confidence: 25,
            },
            waypoint_settings: {
                points: [],
                images_width: null,
                images_height: null,
                heading: null
            }
        };
    },
    components: {
        createFlightSettings,
        CreateProcessSettings,
        CheckSettings,
        SelectResearchSettings,
    },
    methods: {
        cancel() {
            // TODO: Reset all given settings
            this.$router.push({ path: "Landing" });
        },
        start() {
            this.$store.dispatch(
                "setWeightsPath",
                this.process_settings.weights.path
            );
            this.$store.dispatch("setDroneSettings", {
                connection_url: this.drone_settings.connection_url,
                fly_height: this.drone_settings.fly_height,
                use_ftp: this.drone_settings.use_ftp
            });
            // SAVE ALL DATA AND GO TO THE RESEARCH PAGE
            const active_research = {
                research_type: "drone",
                create_date: window.moment(),
                uploaded: false,
                upload_date: null,
                executed: false,
                executed_date: null,
                research_settings: this.research_settings,
                photo_settings: this.photo_settings,
                drone_settings: this.drone_settings,
                process_settings: this.process_settings,
                waypoint_settings: this.waypoint_settings,
            };
            SessionsActions.saveLocalResearch(active_research);
            this.$router.push({ path: "active_drone_research" });
        },
        iterate(obj) {
            var do_return = true;
            if (obj == null) {
                return false;
            } else {
                for (const [key, value] of Object.entries(obj)) {
                    if (typeof value === "object" && key != "made_by") {
                        if (!this.iterate(obj[key])) {
                            do_return = false;
                            break;
                        }
                    } else if (value == null) {
                        do_return = false;
                        break;
                    }
                }
                return do_return;
            }
        },
    },
    computed: {
        settings_ready: function () {
            const ready = [
                this.iterate(this.research_settings),
                this.iterate(this.photo_settings),
                this.iterate(this.drone_settings),
                this.iterate(this.process_settings),
                this.iterate(this.waypoint_settings),
                this.waypoint_settings.points.length > 0
            ];
            return ready.every(e => e === true);
        },
    },
};
</script>

    <style lang="css">
.fullscreen {
    height: 100vh;
}
</style>