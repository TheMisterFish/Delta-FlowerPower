<template>
    <div>
        <v-card class="mx-auto card-spacer mb-5">
            <v-card-text v-if="sd_research">
                <h4>Onderzoek: {{research_settings.name}}</h4>
                <h4>Model: {{process_settings.model}}</h4>
                <h4>Weights: {{process_settings.weights && process_settings.weights.name}}</h4>
                <h4>Image width: {{process_settings.image_width}}</h4>
                <h4>Confidence score: {{process_settings.confidence}}</h4>
                <v-btn @click="go_back">Terug</v-btn>
                <v-btn @click="saveSettings" class="primary">Opslaan en verder</v-btn>
            </v-card-text>
            <v-card-text v-else>
                DRONE RESEARCH!
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "CheckSettings",
    props: {
        research_settings: {
            type: Object,
            required: true
        },
        photo_settings: {
            type: Object,
            required: false
        },
        drone_settings: {
            type: Object,
            required: false
        },
        process_settings: {
            type: Object,
            required: true
        },
        sd_research: {
            type: Boolean,
            required: false
        },
        save_settings: {
            type: Function,
            required: false
        },
        go_back: {
            type: Function,
            required: false
        }
    },
    mounted() {
        // TODO
        /* 
            1. Calculate the image cm/px
            2. Try to calculate how many images will be taken
        */
    },
    methods: {
        saveSettings() {
            this.$store.dispatch("setWeightsPath", this.process_settings.weights.path)
            this.$store.dispatch("setAiSettings", {confidence: this.process_settings.confidence, image_size: this.process_settings.image_width })

            this.save_settings();
            //setAiSettings
            //setDroneSettings
            //setResearchSettings
            // TODO
            /* 
                1. Show all settinsg in template above 
                2. Save all settings to store, go to new page where we start the drone kit and stuff.
                3. Check if all inputs are set up correct
            */
        }
    }
};
</script>

<style lang="css" scoped>
</style>
