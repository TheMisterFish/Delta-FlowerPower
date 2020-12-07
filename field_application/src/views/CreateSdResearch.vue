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

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 4" step="4">
                    Detectie
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <select-research-settings
                        :research_settings="research_settings"
                    ></select-research-settings>

                    <v-spacer></v-spacer>

                    <v-btn :disabled="!research_settings.name" color="primary" @click="e1 = 2"> Verder </v-btn>
                    <v-btn text @click="$router.go(-1)"> Terug </v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <create-process-settings
                        :process_settings="process_settings"
                    ></create-process-settings>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="e1 = 3"> Verder </v-btn>
                    <v-btn text @click="$router.go(-1)"> Terug </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <check-settings sd_research :go_back="() => e1 = 2" :save_settings="() => e1 =  4" :research_settings="research_settings" :process_settings="process_settings"></check-settings>

                    <v-spacer></v-spacer>
                </v-stepper-content>

                <v-stepper-content step="4">
                    <detect></detect>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-layout>
</template>

<script>
import SelectResearchSettings from "@/components/research_components/SelectResearchSettingsComponent.vue";
import CreateProcessSettings from "@/components/research_components/CreateProcessSettingsComponent.vue";
import CheckSettings from "@/components/research_components/CheckSettingsComponent.vue";
import Detect from "@/components/research_components/DetectComponent.vue";

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
        Detect,
        SelectResearchSettings,
        CheckSettings
    },
    created: function () {
        this.$store.dispatch("getResearches");
        this.$store.dispatch("getModels");
    },
};
</script>

<style lang="css">
.fullscreen {
    height: 100vh;
}
</style>
