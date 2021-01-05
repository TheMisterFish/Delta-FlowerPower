<template>
    <div>
        <p class="subtitle-2 text-center">Vlieg instellingen</p>

        <v-text-field
            append-icon="mdi-upload-outline"
            label="Vlieg hoogte (m)"
            type="number"
            hint="3 tot 5 meter"
            v-model="drone_settings.fly_height"
        ></v-text-field>

        <br />
        <br />

        <p class="subtitle-2 text-center">Camera instellingen</p>

        <v-text-field
            append-icon="mdi-camera-iris"
            label="Sensor breedte (mm)"
            type="number"
            hint="DJI Spark: 6.17mm"
            v-model="photo_settings.sensor_width"
        ></v-text-field>
        <br />
        <v-text-field
            append-icon="mdi-arrow-split-horizontal"
            label="Brandpuntsafstand (mm)"
            type="number"
            hint="DJI Spark: 4.55mm"
            v-model="photo_settings.focal_length"
        ></v-text-field>
        <br />
        <v-text-field
            append-icon="mdi-image-outline"
            label="Afbeelding breedte (pixels)"
            type="number"
            hint="DJI Spark: 3968 pixels"
            v-model="photo_settings.image_width"
        ></v-text-field>
        <br />
        <v-text-field
            append-icon="mdi-image-outline"
            label="Afbeelding hoogte (pixels)"
            type="number"
            hint="DJI Spark: 2976 pixels"
            v-model="photo_settings.image_height"
        ></v-text-field>
        <br />
        <br />

        <p class="subtitle-2 text-center">Andere instellingen</p>

        <v-checkbox
            v-model="drone_settings.use_ftp"
            label="Gebruik maken van FTP"
        ></v-checkbox>
        <v-text-field
            append-icon="mdi-wifi"
            label="Drone connectie ip adress"
            type="string"
            hint="127.0.0.1:16670"
            v-model="drone_settings.connection_url"
        ></v-text-field>
        
    </div>
</template>

<script>
export default {
    name: "CreateFlightSettings",
    props: {
        photo_settings: {
            required: true,
            type: Object,
        },
        drone_settings: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {
            checkbox: false,
        };
    },
};
</script>

<style lang="css" scoped>
</style>
