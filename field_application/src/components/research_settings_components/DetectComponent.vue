<template>
    <div>
        <v-btn @click="detectImages"> Start detectie </v-btn>
        <v-row>
            <v-col v-for="(image, index) in images" :key="index" cols="12">
                <AnnotatedImage
                    :imagePath="image.filePath"
                    :boundingBoxes="image.boundingBoxes"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>
//TODO CREATE A NEW COMPONENT WHERE WE DO THE ACTUAL DETECTION. KEEP THIS AS A CONFIRM PAGE
import { IPC_CHANNELS, IPC_MESSAGES, SOCKET_CHANNELS } from "../../constants";
import { IpcMessage } from "../../IpcMessage";
import AnnotatedImage from "../../components/AnnotatedImage.vue";
import { mapState } from "vuex";
export default {
    name: "ControlSettings",
    components: {
        AnnotatedImage,
    },
    data: () => ({
        images: [],
    }),
    computed: {
        ...mapState({
            messages: (state) => state.socket.messages,
        }),
    },
    props: {
        addResult: Function
    },
    watch: {
        messages(newValue, oldValue) {
            const message = JSON.parse(newValue[newValue.length - 1]);
            if (message.message === "BOUNDING_BOXES") {
                const image = message.data.image;
                const boundingBoxes = message.data.boundingBoxes;
                this.images.forEach((i) => {
                    if (i.filePath.includes(image)) {
                        i.boundingBoxes = i.boundingBoxes.concat(boundingBoxes);
                    }
                });
            } else if(message.message === "DETECTION_FINISHED") {
                this.addResult(this.images)
            }
        },
    },
    methods: {
        detectImages() {
            const imagesPath = this.$store.getters.getPath;
            const weightsPath = this.$store.getters.getWeightsPath;
            const confidence = this.$store.getters.getConfidence;
            const imageSize = this.$store.getters.getImageSize;
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    SOCKET_CHANNELS.DETECT_IMAGES,
                    weightsPath,
                    imagesPath,
                    confidence / 100,
                    imageSize,
                ])
            );
        },
    },
    created: async function () {
        const path = this.$store.getters.getPath;

        const ipcMessage = new IpcMessage(
            IPC_MESSAGES.GET_IMAGE_FILES_FROM_FOLDER,
            path
        );

        const response = await window.electron.invoke(
            IPC_CHANNELS.FILESYSTEM,
            ipcMessage
        );
        if (response) {
            response.forEach((r) => {
                this.images.push({
                    image: r,
                    filePath: `${path}\\${r}`,
                    boundingBoxes: [],
                });
            });
        }
    },
};
</script>

<style lang="css" scoped></style>
