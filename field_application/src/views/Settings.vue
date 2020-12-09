<template>
    <div>
        <v-toolbar color="primary" dark flat
        >       
            <v-btn text to="Dashboard">Terug</v-btn>
            <v-tabs v-model="tabs" right>
                <v-tab>Onderzoeken</v-tab>
                <v-tab>AI</v-tab>
            </v-tabs>
        </v-toolbar>

        <v-tabs-items v-model="tabs">
            <v-tab-item>
                <research-settings></research-settings>
            </v-tab-item>
            <v-tab-item>
                <ai-settings></ai-settings>
            </v-tab-item>
            <v-tab-item>
                
            </v-tab-item>
        </v-tabs-items>
        </div>
</template>

<script>
import AiSettings from "@/components/setting_components/AiSettingsComponent.vue";
import ResearchSettings from "@/components/setting_components/ResearchSettingsComponent.vue";
export default {
    data () {
    return {
        tabs: null,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    }
    },
    components: {
        AiSettings,
        ResearchSettings
    },
}
</script>
<style lang="css" scoped>

</style>
