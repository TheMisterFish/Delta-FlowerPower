<template>
  <v-layout fill-height column ma-0>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Name of step 1
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          Name of step 2
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3"> Name of step 3 </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <create-settings></create-settings>
          
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="e1 = 2"> Verder </v-btn>
          <v-btn text @click="$router.go(-1)"> Terug </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <create-connect></create-connect>

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
import CreateSettings from "@/components/research_components/CreateSettingsComponent.vue";
import CreateConnect from "@/components/research_components/CreateConnectComponent.vue";
import ControlSettings from "@/components/research_components/ControlSettingsComponent.vue";
export default {
  data() {
    return {
      e1: 1,
    };
  },
  components: {
    CreateSettings,
    CreateConnect,
    ControlSettings
  },
};
</script>

<style lang="css">
.fullscreen {
  height: 100vh;
}
</style>