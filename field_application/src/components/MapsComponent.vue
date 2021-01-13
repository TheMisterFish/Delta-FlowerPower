<template>
    <div>
        <GmapMap
            :center="{
                lat: this.research_settings.pos_x_1,
                lng: this.research_settings.pos_y_1,
            }"
            :zoom="17.6"
            map-type-id="terrain"
            style="width: 100%; height: 400px"
            :options="{
                disableDefaultUI : true
            }"
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
                :key="m.id"
                v-for="(m) in computed_matrixmarkers"
                :position="m.position"
                :clickable="true"
                :draggable="false"
                @click="center = m.position"
                icon="http://maps.google.com/mapfiles/ms/icons/pink-dot.png"
            />
        </GmapMap>
        <p>
            De blauwe punten zijn de twee locatie punten. De rode punten zijn de punten waar de drone foto's zal maken.
        </p>
        <!-- {{ computed_matrixmarkers }} -->
    </div>
</template>

<script>
export default {
    props: {
        points: {
            type: Array,
            required: true
        },
        research_settings: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            homemarkers: [
                {
                    position: {
                        id: 0,
                        lat: this.research_settings.pos_x_1,
                        lng: this.research_settings.pos_y_1,
                    },
                },
                {
                    position: {
                        id: 1,
                        lat: this.research_settings.pos_x_3,
                        lng: this.research_settings.pos_y_3,
                    },
                },
                {
                    position: {
                        id: 2,
                        lat: this.research_settings.pos_x_2,
                        lng: this.research_settings.pos_y_2,
                    },
                },
                {
                    position: {
                        id: 3,
                        lat: this.research_settings.pos_x_4,
                        lng: this.research_settings.pos_y_4,
                    },
                },
            ],
            matrixmarkers: [],
        };
    },
    computed: {
        computed_matrixmarkers: function () {
            return this.matrixmarkers;
        },
    },
    mounted() {
        this.updateMap();
    },
    watch: {
        points(value){
            this.updateMap();
        }
    },
    methods: {
        updateMap() {
            var counter = 4;
            this.matrixmarkers = [];
            this.points.forEach((new_point) => {
                let object = {
                    position: {
                        id: counter,
                        lat: new_point[0],
                        lng: new_point[1],
                    },
                };
                this.matrixmarkers.push(object);
                counter -=- 1;
            });
        }
    },
};
</script>

<style lang="css" scoped>
</style>
