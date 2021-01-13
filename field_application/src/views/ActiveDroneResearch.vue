<template>
    <div id="dashboard">
        <v-container class="mb-5">
            <v-row>
                <v-col cols="12" sm="12">
                    <h3 class="text-center">Logs</h3>
                </v-col>
                <v-col cols="12" sm="12">
                    <v-virtual-scroll
                        height="260"
                        item-height="29"
                    ></v-virtual-scroll>
                </v-col>
                <hr />
                <v-col cols="12" sm="12">
                    <h3 class="text-center">Acties</h3>
                </v-col>
                <v-col cols="12" sm="12"> 
                    <v-btn class="full_width" color="primary" x-large>Connect drone</v-btn>
                </v-col>
                <v-col cols="12" sm="12"> 
                    <v-btn class="full_width" color="primary" :disabled="!connected" x-large>Start</v-btn>
                </v-col>
                <v-col cols="6" sm="6">
                    <v-btn class="full_width" :disabled="!connected" >Pauzeer</v-btn>
                </v-col>
                <v-col cols="6" sm="6">
                    <v-btn class="full_width" :disabled="!connected" >Verder</v-btn>
                </v-col>
                <v-col cols="6" sm="6">
                    <v-btn class="full_width" :disabled="!connected" >Kom terug</v-btn>
                </v-col>
                <v-col cols="6" sm="6">
                    <v-btn class="full_width" :disabled="!connected" >Land</v-btn>
                </v-col>
                <v-col cols="12" sm="12"> 
                    <v-btn class="full_width" color="error" :disabled="!connected" x-large>Noodstop</v-btn>
                </v-col>
                <v-col cols="12" sm="12" class="mt-16">
                    <v-btn color="error" class="float-right" @click="goBackToDashboard()">terug</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { IPC_CHANNELS, IPC_MESSAGES, SOCKET_CHANNELS } from "../constants";
import { IpcMessage } from "../IpcMessage";
import { mapState } from "vuex";
import Heartbeat from "@/components/research_components/HeartbeatComponent.vue";

export default {
    components: {
        // Heartbeat,
    },
    data() {
        return {
            connected: false,
            logs: [],
            session: {},
        };
    },
    computed: {
        ...mapState({
            messages: (state) => state.socket.messages,
        }),
    },
    mounted() {
        this.session = this.$store.getters.getCurrentSession;
    },
    methods: {
        goBackToDashboard() {
            // are you sure melding laten zien
            // terug gaan naar dashboard & alles vergeten
            // misschien ook de vraag, wil je dit research verwijderen?
        },
        connectDrone() {
            const getConnectionUrl = this.$store.getters.getConnectionUrl;
            const ftp = this.$store.getters.useFtp;
            const fly_height = this.$store.getters.getFlyHeight;
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    SOCKET_CHANNELS.DRONE_INIT,
                    getConnectionUrl,
                    ftp,
                    fly_height,
                ])
            );
        },
        uploadWaypoints() {
            const message = "addWaypoints";
            const waypoints = [null];
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    SOCKET_CHANNELS.DRONE_MESSAGE,
                    message,
                    waypoints,
                ])
            );
        },
        pauzeDrone() {
            const message = "doPauze";
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([SOCKET_CHANNELS.DRONE_MESSAGE, message])
            );
        },
        resumeDrone() {
            const message = "doResume";
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([SOCKET_CHANNELS.DRONE_MESSAGE, message])
            );
        },
        homeDrone() {
            const message = "goHome";
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([SOCKET_CHANNELS.DRONE_MESSAGE, message])
            );
        },
        quickLand() {
            const message = "doLand";
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([SOCKET_CHANNELS.DRONE_MESSAGE, message])
            );
        },
        emergencyStop() {
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([SOCKET_CHANNELS.DRONE_EMERGENCY_STOP])
            );
        },
        quickStop() {
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([SOCKET_CHANNELS.DRONE_STOP])
            );
        },
    },
    watch: {
        messages(newValue, oldValue) {
            const message = JSON.parse(newValue[newValue.length - 1]);
            if (message.message === "DRONERROR") {
                console.log("DRONE ERROR: ", message.data);
            } else if (message.message === "DRONEINFO") {
                console.log("DRONE INFO: ", message.data);
            } else if (message.message === "DRONESTATUS") {
                console.log("DRONE STATUS: ", message.data);
            } else if (message.message === "DRONECONNECTED") {
                this.connected = true;
            }
        },
    },
};
</script>

<style lang="css" scoped>
.full_width{
    width: 100%;
}
</style>
