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
                        <tr @click="test()">
                            <td>CM per pixel:</td>
                            <td>{{ cm_per_px.toFixed(5) }} cm/px</td>
                        </tr>
                        <tr @click="calculateLongestRoute()">
                            <td>Meter per afbeelding:</td>
                            <td>{{ m_per_image_width.toFixed(5) }} m</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <br />
        <br />
        <GmapMap
            :center="{
                lat: this.research_settings.pos_x_1,
                lng: this.research_settings.pos_y_1,
            }"
            :zoom="17.6"
            map-type-id="terrain"
            style="width: 500px; height: 300px"
        >
            <GmapMarker
                :key="index"
                v-for="(m, index) in homemarkers"
                :position="m.position"
                :clickable="true"
                :draggable="false"
                @click="center = m.position"
                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
            <GmapMarker
                :key="index"
                v-for="(m, index) in computed_matrixmarkers"
                :position="m.position"
                :clickable="true"
                :draggable="false"
                @click="center = m.position"
                icon="http://maps.google.com/mapfiles/ms/icons/pink-dot.png"
            />
            <GmapMarker
                :key="index"
                v-for="(m, index) in computed_rotatedmarkers"
                :position="m.position"
                :clickable="true"
                :draggable="false"
                @click="center = m.position"
                icon="http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
            />
        </GmapMap>
        {{ computed_matrixmarkers }}
    </div>
</template>

<script>
import { CalculateActions } from "../../actions";
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
            homemarkers: [
                {
                    position: {
                        lat: this.research_settings.pos_x_1,
                        lng: this.research_settings.pos_y_1,
                    },
                },
                {
                    position: {
                        lat: this.research_settings.pos_x_2,
                        lng: this.research_settings.pos_y_2,
                    },
                },
            ],
            matrixmarkers: [],
            rotatedmarkers: [],
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
        computed_matrixmarkers: function () {
            return this.matrixmarkers;
        },
        computed_rotatedmarkers: function () {
            return this.rotatedmarkers;
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
        calculateLongestRoute() {
            this.matrixmarkers = [];
            this.rotatedmarkers = [];

            const start_pos = [
                this.research_settings.pos_x_1, //s - x 1
                this.research_settings.pos_y_1, // s - y 1
            ];
            const pos_1 = [
                this.research_settings.pos_x_1, //
                this.research_settings.pos_y_2,
            ];
            const pos_2 = [
                this.research_settings.pos_x_2,
                this.research_settings.pos_y_1,
            ];

            // Get longest side
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

            var width, height;
            var images_taken_width, images_taken_height;
            var heading_width, heading_height;

            if (length_1 > length_2) {
                //van links naar rechts
                images_taken_width = Math.ceil(
                    length_1 / this.m_per_image_width
                );
                images_taken_height = Math.ceil(
                    length_2 / this.m_per_image_height
                );
                width = length_1;
                height = length_2;
                heading_width = CalculateActions.bearing(
                    start_pos[0],
                    start_pos[1],
                    pos_1[0],
                    pos_1[1]
                );
                heading_height = CalculateActions.bearing(
                    start_pos[0],
                    start_pos[1],
                    pos_2[0],
                    pos_2[1]
                );
            } else {
                // van boven naar onder
                images_taken_width = Math.ceil(
                    length_2 / this.m_per_image_width
                );
                images_taken_height = Math.ceil(
                    length_1 / this.m_per_image_height
                );
                width = length_2;
                height = length_1;
                heading_width = CalculateActions.bearing(
                    start_pos[0],
                    start_pos[1],
                    pos_2[0],
                    pos_2[1]
                );
                heading_height = CalculateActions.bearing(
                    start_pos[0],
                    start_pos[1],
                    pos_1[0],
                    pos_1[1]
                );
            }

            // Get total images we will take
            const total_images = Math.ceil(
                images_taken_width * images_taken_height
            );
            // Get offsets in meters
            const width_offset =
                (images_taken_width * this.m_per_image_width - width) / 2;
            const height_offset =
                (images_taken_height * this.m_per_image_height - height) / 2;

            // Get real startpos (with image offset)
            console.log(width_offset, height_offset)
            var real_start_pos = CalculateActions.destVincenty(
                start_pos[0],
                start_pos[1],
                heading_width,
                width_offset * -1
            );
            let object1 = {
                position: {
                    lat: real_start_pos[0],
                    lng: real_start_pos[1],
                },
            };
            real_start_pos = CalculateActions.destVincenty(
                real_start_pos[0],
                real_start_pos[1],
                heading_height,
                height_offset * -1
            );
            let object = {
                position: {
                    lat: real_start_pos[0],
                    lng: real_start_pos[1],
                },
            };

            var points_lat = [];
            var points_lon = [];

            var point;
            for (let i = 0; i < images_taken_height; i++) {
                const height_offset = (i * this.m_per_image_height) + (this.m_per_image_height / 2);
                point = CalculateActions.destVincenty(
                    real_start_pos[0],
                    real_start_pos[1],
                    heading_height,
                    height_offset
                );
                for (let i = 0; i < images_taken_width; i++) {
                const width_offset = (i * this.m_per_image_width) + (this.m_per_image_width / 2);
                    let new_point = CalculateActions.destVincenty(
                        point[0],
                        point[1],
                        heading_width,
                        width_offset
                    );
                    let object = {
                        position: {
                            lat: new_point[0],
                            lng: new_point[1],
                        },
                    };
                    this.matrixmarkers.push(object);
                }
            }
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
        test() {
            console.log(CalculateActions.rotate(0, 0, 1, 1, 90));
        },
    },
};
</script>

<style lang="css" scoped>
</style>
