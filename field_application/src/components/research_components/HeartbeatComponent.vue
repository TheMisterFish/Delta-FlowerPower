<template>
    <v-card
        color="grey lighten-4"
    >
        <v-icon
            color="red lighten-2"
            class="mr-12 heart_icon"
            size="32"
        >
            mdi-heart-pulse
        </v-icon>

        <v-spacer></v-spacer>


        <v-sparkline
            class="pt-6"
            :fill="true"
            :smooth="10"
            :value="value"
        ></v-sparkline>
    </v-card>
</template>

<script>
    export default {
        name: "Heartbeat",
        data() {
            return {
                value: [],
                counter: 0,
            }
        }, 
        mounted() {
            setInterval(() => {
                this.value.unshift(this.counter);
                if(this.value.length > 30){
                    this.value.pop();
                }
                this.counter += 1;
                if(this.counter > 5){
                    this.counter = 0;
                }
            }, 200);
        }, 
    }
</script>

<style lang="css" scoped>
.heart_icon{
    position: absolute;
    top: 5px;
    left: 5px;
}
</style>
