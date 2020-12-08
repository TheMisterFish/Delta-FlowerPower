<template>
    <div>
        <v-card v-if="sd_research" class="mx-auto card-spacer mb-5">
            <v-card-text>
                <h4>Onderzoek: {{ research_settings.name }}</h4>
                <h4>Model: {{ process_settings.model }}</h4>
                <h4>
                    Weights:
                    {{
                        process_settings.weights &&
                        process_settings.weights.name
                    }}
                </h4>
                <h4>Image width: {{ process_settings.image_width }}</h4>
                <h4>Confidence score: {{ process_settings.confidence }}</h4>
                <v-btn @click="go_back">Terug</v-btn>
                <v-btn @click="saveSettings" class="primary"
                    >Opslaan en verder</v-btn
                >
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
                        <tr @click="test()">
                            <td>Meter per afbeelding:</td>
                            <td>{{ m_per_image_width.toFixed(5) }} m</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div>
            <v-btn
                @click="calculateWaypoints()"
                color="primary"
                class="mb-5 mr-5"
                >Waypoints uitrekenen</v-btn
            >
            <v-btn
                @click="showMap = true"
                :disabled="!pointsCalculated"
                color="primary"
                class="mb-5 mr-5"
                >Googlemaps laten zien</v-btn
            >
        </div>
        <div v-if="showMap">
            <maps-component
                :points="points"
                :research_settings="research_settings"
            ></maps-component>
        </div>
    </div>
</template>

<script>
import { CalculateActions } from "../../actions";
import MapsComponent from "../MapsComponent";
export default {
    name: "CheckSettings",
    props: {
        research_settings: {
            type: Object,
            required: true,
        },
        photo_settings: {
            type: Object,
            required: false,
        },
        drone_settings: {
            type: Object,
            required: false,
        },
        process_settings: {
            type: Object,
            required: true,
        },
        sd_research: {
            type: Boolean,
            required: false,
        },
        save_settings: {
            type: Function,
            required: false,
        },
        go_back: {
            type: Function,
            required: false,
        },
    },
    data() {
        return {
            matrixmarkers: [],
            showMap: false,
            points: [],
            pointsCalculated: false,
        };
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
        m_per_image_width: function () {
            return (this.cm_per_px * this.photo_settings.image_width) / 100;
        },
        m_per_image_height: function () {
            return (this.cm_per_px * this.photo_settings.image_height) / 100;
        },
    },
    mounted() {
        // TODO
        /* 
            1. Calculate the image cm/px
            2. Try to calculate how many images will be taken
        */
    },
    components: {
        MapsComponent,
    },
    methods: {
        calculateWaypoints() {
            this.matrixmarkers = [];
            // Create startpoint
            let point_1 = [
                this.research_settings.pos_x_1,
                this.research_settings.pos_y_1,
            ];
            // Create second point
            let point_2 = [
                this.research_settings.pos_x_2,
                this.research_settings.pos_y_2,
            ];
            // Get all gps cordinate info from those two points
            this.points = CalculateActions.calculateGpsCords(
                point_1,
                point_2,
                this.m_per_image_width,
                this.m_per_image_height
            );
            this.pointsCalculated = true;

            // Show them on the minimap (TODO: remove later)
        },

        saveSettings() {
            this.$store.dispatch(
                "setWeightsPath",
                this.process_settings.weights.path
            );
            this.$store.dispatch("setAiSettings", {
                confidence: this.process_settings.confidence,
                image_size: this.process_settings.image_width,
            });

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
