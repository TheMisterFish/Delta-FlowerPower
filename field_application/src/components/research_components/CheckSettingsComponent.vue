<template>
    <div>
        <v-card v-if="sd_research" class="mx-auto card-spacer mb-5">
            <v-card-text>
                <h4>Onderzoek: {{research_settings.name}}</h4>
                <h4>Model: {{process_settings.model}}</h4>
                <h4>Weights: {{process_settings.weights && process_settings.weights.name}}</h4>
                <h4>Image width: {{process_settings.image_width}}</h4>
                <h4>Confidence score: {{process_settings.confidence}}</h4>
                <v-btn @click="go_back">Terug</v-btn>
                <v-btn @click="saveSettings" class="primary">Opslaan en verder</v-btn>
            </v-card-text>
        </v-card>

        <div v-else class="text--primary mb-5">
            <p class="subtitle-2 text-center">Foto instellingen</p>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td>Vlieg hoogte (meters):</td>
                            <td>{{ drone_settings.fly_height }} m</td>
                        </tr>
                        <tr>
                            <td>Sensor breedte (mm):</td>
                            <td>{{ photo_settings.sensor_width }} mm</td>
                        </tr>
                        <tr>
                            <td>Brandpuntsafstand (mm):</td>
                            <td>{{ photo_settings.focal_length }} mm</td>
                        </tr>
                        <tr>
                            <td>Afbeelding breedte (pixels):</td>
                            <td>{{ photo_settings.image_width }} px</td>
                        </tr>
                        <tr>
                            <td>CM per pixel:</td>
                            <td>{{ cm_per_px.toFixed(5) }} cm/px</td>
                        </tr>
                        <tr @click="calculateLongestRoute()">
                            <td>Meter per afbeelding:</td>
                            <td>{{ cm_per_image_width.toFixed(5) }} m</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>

<script>
import { CalculateActions } from "../../actions"
export default {
    name: "CheckSettings",
    props: {
        research_settings: {
            type: Object,
            required: true,
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
            required: true,
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
    data() {
        return {};
    },
    computed: {
        cm_per_px: function () {
            return (
                (this.photo_settings.sensor_width *
                    this.drone_settings.fly_height *
                    100) /
                (this.photo_settings.focal_length *
                    this.photo_settings.image_width)
            );
        },
        cm_per_image_width: function () {
            return (this.cm_per_px * this.photo_settings.image_width) / 100;
        },
        cm_per_image_height: function () {
            return (this.cm_per_px * this.photo_settings.image_height) / 100;
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
        calculateLongestRoute() {
            const start_pos = [
                this.research_settings.pos_x_1,
                this.research_settings.pos_y_1,
            ];
            const pos_1 = [
                this.research_settings.pos_x_1,
                this.research_settings.pos_y_2,
            ];
            const pos_2 = [
                this.research_settings.pos_x_2,
                this.research_settings.pos_y_1,
            ];

            const length_1 = CalculateActions.distanceInMBetweenEarthCoordinates(
                start_pos[0],
                start_pos[1],
                pos_1[0],
                pos_1[1]
            );
            const length_2 = CalculateActions.distanceInMBetweenEarthCoordinates(
                start_pos[0],
                start_pos[1],
                pos_2[0],
                pos_2[1]
            );
            var heading;
            var images_taken_width;
            var images_taken_height;
            const a = { lon: start_pos[0], lat: start_pos[1], elv: this.drone_settings.fly_height};
            var b = {lon: null, lat: null, elv: null};
            if (length_1 > length_2) {
                images_taken_width = length_1 / this.cm_per_image_width;
                images_taken_height = length_2 / this.cm_per_image_height;
                b = { lat: pos_1[0], lon: pos_1[1], elv: this.drone_settings.fly_height};
            } else {
                images_taken_width = length_2 / this.cm_per_image_width;
                images_taken_height = length_1 / this.cm_per_image_height;
                b = { lon: pos_2[0], lat: pos_2[1], elv: this.drone_settings.fly_height};
            }
            heading = CalculateActions.CalculateAzimuth(a, b);
            var total_images = Math.ceil(
                Math.ceil(images_taken_width) * Math.ceil(images_taken_height)
            );
            
            console.log(total_images);
            console.log(Math.ceil(images_taken_width));
            console.log(Math.ceil(images_taken_height));
            console.log(heading);
            console.log(length_1);
            console.log(length_2);

            // CalculateActions.CalculateAzimuth();
        },

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
        },

       
    },
};
</script>

<style lang="css" scoped>
</style>
