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

                    <v-btn color="primary" @click="e1 = 2"> Verder </v-btn>
                    <v-btn text @click="cancelFunction"> Anuleren </v-btn>
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
                    ></check-settings>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="e1 = 1"> Start </v-btn>
                    <v-btn text @click="e1 = 3"> Terug </v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-layout>
</template>

    <script>
import SelectResearchSettings from "@/components/research_components/SelectResearchSettingsComponent.vue";
import createFlightSettings from "@/components/research_components/CreateFlightSettingsComponent.vue";
import CreateProcessSettings from "@/components/research_components/CreateProcessSettingsComponent.vue";
import CheckSettings from "@/components/research_components/CheckSettingsComponent.vue";

export default {
    name: "DroneResearch",
    data() {
        return {
            e1: 4,
            research_settings: {
                name: null,
                pos_x_1: 51.692762437171844, 
                pos_y_1: 5.855453456389448,
                pos_x_2: 51.6870915114924, 
                pos_y_2: 5.870382083372147
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
            },
            process_settings: {
                model: null,
                weight: null,
                image_width: null,
                confidence: 25,
            },
        };
    },
    components: {
        createFlightSettings,
        CreateProcessSettings,
        CheckSettings,
        SelectResearchSettings,
    },
    methods: {
        cancelFunction() {
            this.$router.push({ path: "Landing" });
        },
    },
};
</script>

    <style lang="css">
.fullscreen {
    height: 100vh;
}
</style>