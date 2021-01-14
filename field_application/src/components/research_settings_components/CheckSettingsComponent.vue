<template>
    <div>
        <div  v-if="!sd_research" class="text--primary mb-5">
            <p class="subtitle-2 text-center">Research instellingen</p>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td>Onderzoek:</td>
                            <td>{{ research_settings.research.name }}</td>
                        </tr>
                        <tr>
                            <td>Beschrijving:</td>
                            <td>{{ research_settings.research.description }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div  v-if="!sd_research" class="text--primary mb-5">
            <p class="subtitle-2 text-center">Drone instellingen</p>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td>Connectie ip adress:</td>
                            <td>{{ drone_settings.connection_url }}</td>
                        </tr>
                        <tr>
                            <td>Vlieg hoogte (meters):</td>
                            <td>{{ drone_settings.fly_height }} m</td>
                        </tr>
                        <tr>
                            <td>Gebruik maken van FTP:</td>
                            <td>{{ drone_settings.use_ftp ? "Ja" : "Nee" }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div  v-if="!sd_research" class="text--primary mb-5">
            <p class="subtitle-2 text-center">Foto instellingen</p>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
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
                            <td>Afbeelding hoogte (pixels):</td>
                            <td>{{ photo_settings.image_height }} px</td>
                        </tr>
                        <tr>
                            <td>CM per pixel:</td>
                            <td>{{ cm_per_px.toFixed(5) }} cm/px</td>
                        </tr>
                        <tr>
                            <td>Meter per afbeelding:</td>
                            <td>{{ m_per_image_width.toFixed(5) }} m</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div v-if="drone_settings && drone_settings.use_ftp || sd_research" class="text--primary mb-5">
            <p class="subtitle-2 text-center">AI instellingen</p>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td>AI Model gebruikt voor herkenning:</td>
                            <td>{{ process_settings.model ? process_settings.model.name : ""}}</td>
                        </tr>
                        <tr>
                            <td>AI Gewichten gebruikt voor herkenning:</td>
                            <td>{{ process_settings.weights ? process_settings.weights.name : "" }}</td>
                        </tr>
                        <tr>
                            <td>De grootte van een gesneden afbeelding voor herkenning</td>
                            <td>{{ process_settings.detect_width }} px</td>
                        </tr>
                        <tr>
                            <td>Hoe zeker de AI moet zijn</td>
                            <td>{{ process_settings.confidence }}%</td>
                        </tr>
                        <tr v-if="sd_research">
                            <td>Pad van de foto's</td>
                            <td>{{ $store.getters.getPath }}</td>
                        </tr>
                        
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div v-if="!sd_research">
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
                :points="waypoint_settings.points"
                :research_settings="research_settings"
            ></maps-component>
        </div>
        <div v-if="!sd_research" class="text--primary mb-5 mt-2">
            <p class="subtitle-2 text-center">Waypoints</p>
            <v-simple-table dense>
                <template>
                    <tbody>
                        <tr>
                            <td>Aantal waypoints:</td>
                            <td>{{ waypoint_settings.points.length }}</td>
                        </tr>
                        <tr>
                            <td>Waypoints in de breedte</td>
                            <td>{{ waypoint_settings.images_width }}</td>
                        </tr>
                        <tr>
                            <td>Waypoints in de hoogte</td>
                            <td>{{ waypoint_settings.images_height }}</td>
                        </tr>
                        <tr>
                            <td>Drone richting</td>
                            <td>{{ waypoint_settings.heading }}°</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
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
        waypoint_settings: {
            type: Object,
            required: false,
        }
    },
    data() {
        return {
            matrixmarkers: [],
            showMap: false,
            pointsCalculated: false,
            images_width: 0,
            images_height: 0,
            points: [],
            heading: 0
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
            let point_3 = [
                this.research_settings.pos_x_3,
                this.research_settings.pos_y_3,
            ];
            let point_4 = [
                this.research_settings.pos_x_4,
                this.research_settings.pos_y_4,
            ];
            // Get all gps cordinate info from those two points
            const data = CalculateActions.calculateGpsCords(
                point_1,
                point_2,
                point_3,
                point_4,
                this.m_per_image_width,
                this.m_per_image_height
            );
            this.waypoint_settings.points = data.points
            this.waypoint_settings.images_width = data.width;
            this.waypoint_settings.images_height = data.height;
            this.waypoint_settings.heading = Math.ceil(data.heading);
            this.pointsCalculated = true;
        },
    },
};
</script>

<style lang="css" scoped>
</style>
