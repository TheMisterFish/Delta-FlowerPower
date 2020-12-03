<template>
  <v-layout fill-height column ma-0>
    <v-stepper v-model="e1" style="height: 100%; min-height: 100vh">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Name of step 1
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          Name of step 2
        </v-stepper-step>

      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <create-process-settings :process_settings="process_settings"></create-process-settings>
          
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="e1 = 2"> Verder </v-btn>
          <v-btn text @click="$router.go(-1)"> Terug </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2" >
          <control-settings></control-settings>

          <v-spacer></v-spacer>
          
          <v-btn color="primary" @click="e1 = 2"> Verder </v-btn>
          <v-btn text @click="e1 = 1"> Terug </v-btn>
        </v-stepper-content>

      </v-stepper-items>
    </v-stepper>
  </v-layout>
</template>

<script>
import CreateProcessSettings from "@/components/research_components/CreateProcessSettingsComponent.vue";
import ControlSettings from "@/components/research_components/ControlSettingsComponent.vue";
export default {
  name: "DroneResearch",
  data() {
    return {
      e1: 1,
      photo_settings: {
        sensor_width: null,
        focal_length: null,
        image_width: null,
      },
      process_settings: {
        model: null,
        weight: null,
        image_width: null,
        confidence: 25
      }
    };
  },
  components: {
    CreateProcessSettings,
    ControlSettings
  },
};
</script>

<style lang="css">
.fullscreen {
  height: 100vh;
}
</style>