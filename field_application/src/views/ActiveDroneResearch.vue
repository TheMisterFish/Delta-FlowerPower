<template>
    <div>
        <h3>Logs</h3>
        <v-virtual-scroll
            height="175"
            item-height="29"
        ></v-virtual-scroll>
        <hr>
        <h3>Acties</h3>
        Actie knop 1, 2, 3
        <hr>
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
            logs: []
        }
    },
    computed: {
        ...mapState({
            messages: (state) => state.socket.messages,
        }),
    },
    methods: {
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
                    fly_height
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
                JSON.stringify([
                    SOCKET_CHANNELS.DRONE_MESSAGE,
                    message
                ])
            );
        },
        resumeDrone() {
            const message = "doResume";
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    SOCKET_CHANNELS.DRONE_MESSAGE,
                    message
                ])
            );
        },
        homeDrone() {
            const message = "goHome";
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    SOCKET_CHANNELS.DRONE_MESSAGE,
                    message
                ])
            );
        },
        quickLand() {
            const message = "doLand";
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    SOCKET_CHANNELS.DRONE_MESSAGE,
                    message
                ])
            );
        },
        emergencyStop() {
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    SOCKET_CHANNELS.DRONE_EMERGENCY_STOP
                ])
            );
        },
        quickStop() {
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    SOCKET_CHANNELS.DRONE_STOP
                ])
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
            } else if(message.message === "DRONECONNECTED"){
                this.connected = true;
            }
        },
    },
};
</script>

<style lang="css" scoped>
</style>
