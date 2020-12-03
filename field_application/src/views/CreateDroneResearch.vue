<template>
  <v-layout fill-height column ma-0>
    <v-stepper v-model="e1" style="height: 100%; min-height: 100vh">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Name of step 1
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2" :rules="[() =>drone_settings.use_ftp]">
          Name of step 2
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3"> Name of step 3 </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <create-flight-settings :photo_settings="photo_settings" :drone_settings="drone_settings"></create-flight-settings>
          
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="e1 = 2"> Verder </v-btn>
          <v-btn text @click="$router.go(-1)"> Terug </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2" >
          <create-process-settings :process_settings="process_settings" :process_disabled="!drone_settings.use_ftp"></create-process-settings>

          <v-spacer></v-spacer>
          
          <v-btn color="primary" @click="e1 = 3"> Verder </v-btn>
          <v-btn text @click="e1 = 1"> Terug </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <control-settings></control-settings>

          <v-spacer></v-spacer>

          <v-btn color="primary" @click="e1 = 1"> Verder </v-btn>
          <v-btn text @click="e1 = 2"> Terug </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-layout>
</template>

<script>
import createFlightSettings from "@/components/research_components/CreateFlightSettingsComponent.vue";
import CreateProcessSettings from "@/components/research_components/CreateProcessSettingsComponent.vue";
import ControlSettings from "@/components/research_components/ControlSettingsComponent.vue";
export default {
  name: "SdResearch",
  data() {
    return {
      e1: 1,
      photo_settings: {
        sensor_width: null,
        focal_length: null,
        image_width: null,
      },
      drone_settings: {
        fly_height: null,
        use_ftp: true,
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
    createFlightSettings,
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