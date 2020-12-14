<template>
    <div>
        <v-btn class="ma-4" to="landing">Terug</v-btn>
        <detect-component></detect-component>
    </div>
</template>

<script>
import DetectComponent from "@/components/research_settings_components/DetectComponent.vue";
export default {
    components: {
        DetectComponent,
    },
};
</script>

<style lang="css" scoped>
</style>
