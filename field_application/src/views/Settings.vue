<template>
  <div>
    <v-toolbar color="primary" dark flat>
      <v-btn text to="Dashboard">Terug</v-btn>
      <v-tabs v-model="tabs" right>
        <v-tab>AI</v-tab>
        <v-tab>Onderzoeken</v-tab>
        <v-tab>Lokale onderzoeken</v-tab>
      </v-tabs>
      <v-btn @click="logout" icon>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <ai-settings></ai-settings>
      </v-tab-item>
      <v-tab-item>
        <research-settings></research-settings>
      </v-tab-item>
      <v-tab-item>
        <local-research-settings></local-research-settings>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AiSettings from "@/components/setting_components/AiSettingsComponent.vue";
import ResearchSettings from "@/components/setting_components/ResearchSettingsComponent.vue";
import LocalResearchSettings from "@/components/setting_components/LocalResearchSettingsComponent.vue";
export default {
  data() {
    return {
      tabs: null,
    };
  },
  components: {
    AiSettings,
    ResearchSettings,
    LocalResearchSettings,
  },
  methods: {
    logout() {
      localStorage.removeItem("email");
      localStorage.removeItem("password");

      this.$router.push({ name: "Landing"});
    },
  },
};
</script>
<style lang="css" scoped></style>
