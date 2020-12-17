<template>
    <v-layout fill-height column ma-0>
        <v-stepper v-model="e1" style="height: 100%; min-height: 100vh">
            <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">
                    Onderzoek instellingen
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">
                    Process instellingen
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 3" step="3">
                    Bevestiging
                </v-stepper-step>

                <!-- <v-divider></v-divider> -->
<!-- 
                <v-stepper-step :complete="e1 > 4" step="4">
                    Detectie
                </v-stepper-step> -->
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <select-research-settings
                        :research_settings="research_settings"
                    ></select-research-settings>

                    <v-spacer></v-spacer>

                    <v-btn :disabled="!research_settings.name" color="primary" @click="e1 = 2"> Verder </v-btn>
                    <v-btn text @click="cancel()"> Terug </v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <create-process-settings
                        :process_settings="process_settings"
                    ></create-process-settings>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="e1 = 3"> Verder </v-btn>
                    <v-btn text @click="e1 = 1"> Terug </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <check-settings sd_research :research_settings="research_settings" :process_settings="process_settings"></check-settings>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" :disabled="!settings_ready" @click="start()"> Start </v-btn>
                    <v-btn text @click="e1 = 2"> Terug </v-btn>
                </v-stepper-content>

                <!-- <v-stepper-content step="4">
                    <detect></detect>
                </v-stepper-content> -->
            </v-stepper-items>
        </v-stepper>
    </v-layout>
</template>

<script>
import SelectResearchSettings from "@/components/research_settings_components/SelectResearchSettingsComponent.vue";
import CreateProcessSettings from "@/components/research_settings_components/CreateProcessSettingsComponent.vue";
import CheckSettings from "@/components/research_settings_components/CheckSettingsComponent.vue";
// import Detect from "@/components/research_settings_components/DetectComponent.vue";

export default {
    name: "DroneResearch",
    data() {
        return {
            e1: 1,
            research_settings: {
                name: null,
                pos_1: null,
                pos_2: null,
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
        CreateProcessSettings,
        SelectResearchSettings,
        CheckSettings,
        // Detect
    },
    computed: {
        settings_ready: function() {
            return true;
        }
    },
    methods: {
        cancel() {
            // TODO: Reset all given settings
            this.$router.push({ path: "Landing" });
        },
        start() {
            //  Save settings
            this.$store.dispatch(
                "setWeightsPath",
                this.process_settings.weights.path
            );
            this.$store.dispatch("setAiSettings", {
                confidence: this.process_settings.confidence,
                image_size: this.process_settings.image_width,
            });

            this.$router.push({ path: "active_sd_research" });
        }
    },
};
</script>

<style lang="css">
.fullscreen {
    height: 100vh;
}
</style>
