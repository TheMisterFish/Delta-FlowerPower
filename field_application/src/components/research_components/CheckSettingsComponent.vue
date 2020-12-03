<template>
    <div>
        <v-card class="mx-auto card-spacer mb-5">
            <v-card-text>
                <div>Onderzoek: </div>
                <div class="text--primary">

                </div>
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
            required: true
        },
        drone_settings: {
            type: Object,
            required: true
        },
        process_settings: {
            type: Object,
            required: true
        },
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
