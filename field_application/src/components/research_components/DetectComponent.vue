<template>
    <div>
        <!-- <h2>Controlleer of alle info goed is</h2>

                <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card> -->
        <v-btn @click="detectImages"> Start detectie </v-btn>
        <v-row>
            <v-col v-for="(image, index) in images" :key="index" cols="12">
                <AnnotatedImage
                    :imagePath="image.filePath"
                    :boundingBoxes="image.boundingBoxes"
                /> </v-col
        ></v-row>
    </div>
</template>

<script>
//TODO CREATE A NEW COMPONENT WHERE WE DO THE ACTUAL DETECTION. KEEP THIS AS A CONFIRM PAGE
import { DETECT_IMAGES, FILESYSTEM, IPC_MESSAGES } from "../../constants";
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
            }
        },
    },
    methods: {
        detectImages() {
            //TODO CHANGE HARDCODED VALUES WITH VALUES FROM THE STORE
            this.$store.dispatch(
                "sendWebSocketMessage",
                JSON.stringify([
                    DETECT_IMAGES,
                    "C:\\Users\\sueno\\Documents\\baboo\\YoloV5 best weights.pt",
                    this.$store.getters.getPath,
                    this.outputFolder,
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

        const response = await window.electron.invoke(FILESYSTEM, ipcMessage);

        response.forEach((r) => {
            this.images.push({
                image: r,
                filePath: `${path}\\${r}`,
                boundingBoxes: [],
            });
        });
    },
};
</script>

<style lang="css" scoped></style>
