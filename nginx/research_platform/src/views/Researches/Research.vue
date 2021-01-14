<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-card class="card ma-auto pa-8 pb-4" flat>
          <v-card-title class="pl-0 pt-0"
            >{{ research && research.name }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-subtitle class="pl-0">{{
            research && research.description
          }}</v-card-subtitle>
          <v-row v-if="research">
            <v-data-table
              :headers="sessionsHeaders"
              :items="research.sessions"
              hide-default-footer
              class="sessions-table"
              @click:row="openSession"
            ><template v-slot:[`item.created_at`]="{ item }">
        <span>{{ new Date(item.created_at).toDateString() }}</span>
      </template>

      <template v-slot:[`item.updated_at`]="{ item }">
        <span>{{
          item.updated_at ? new Date(item.updated_at).toDateString() : ""
        }}</span>
      </template></v-data-table>
            <v-col
              v-for="(result, index) in research.results"
              :key="index"
              cols="12"
            >
              <AnnotatedImage
                :imagePath="
                  'http://localhost:7080/' +
                    result.file.filePath.split(/\/(.+)/)[1]
                "
                :boundingBoxes="result.boundingBoxes"
              />
            </v-col>
          </v-row>

          <v-card-actions class="d-flex justify-space-between">
            <v-btn @click="deleteResearch" text color="error">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { STATUS } from "../../store/storeResponse";
import AnnotatedImage from "../../components/AnnotatedImage";

export default {
  name: "Research",
  components: {
    AnnotatedImage,
  },
  data: () => ({
    sessionsHeaders: [
      { text: "Session", value: "name" },
      { text: "Created at", value: "created_at" },
      { text: "Updated at", value: "updated_at" },
      { text: "Made by", value: "made_by.fullname" },
      { text: "Images", value: "results.length" },
      { text: "Confidence", value: "confidence" },
      { text: "Session type", value: "session_type" },
      { text: "AI model", value: "aimodel.name" },
    ],
  }),
  computed: {
    ...mapState(["researches"]),
    _id() {
      return this.$route.params.id;
    },
    research: function() {
      const _id = this._id;
      return this.researches.researches.find((r) => r._id === _id);
    },
  },
  methods: {
    async deleteResearch() {
      const response = await this.$store.dispatch("deleteResearch", this._id);

      if (response.status === STATUS.SUCCESS) {
        this.$router.push({ name: "researches" });
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    },

    openSession(session) {
      this.$router.push({
        name: "research/:id/:sessionId",
        params: { id: session.research, sessionId: session._id, title: session.name},
      });
    },
  },

  created: async function() {
    if (!this.research) {
      const response = await this.$store.dispatch("getResearch", this._id);

      if (response.status === STATUS.SUCCESS) {
        this.name = response.data.name;
        this.description = response.data.description;
      } else {
        this.$store.dispatch("showSnackbar", response.message);
      }
    }
  },
};
</script>

<style scoped>
.card {
  max-width: 1400px;
}

.sessions-table >>> tbody tr:hover {
  cursor: pointer;
}
</style>
