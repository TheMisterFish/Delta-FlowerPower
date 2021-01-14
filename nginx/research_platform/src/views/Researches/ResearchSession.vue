<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-card class="card ma-auto pa-8 pb-4" flat>
          <v-card-title class="pl-0 pt-0"
            >{{ session && session.name }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-row v-if="session">
            <v-col
              v-for="(result, index) in session.results"
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import AnnotatedImage from "../../components/AnnotatedImage";
import { STATUS } from '../../store/storeResponse';

export default {
  name: "Research",
  components: {
    AnnotatedImage,
  },
  computed: {
    ...mapState(["researches"]),
    _id() {
      return this.$route.params.sessionId;
    },

    research_id() {
        return this.$route.params.id
    },

    session: function() {
      const _id = this._id;
      const research_id = this.research_id;

      const research = this.researches.researches.find(r => r._id === research_id)

      const session = research.sessions.find(s => s._id === _id);

      return session;
    },
  },

  created: async function() {
    if (!this.session) {
      const response = await this.$store.dispatch("getResearches");

      if (response.status !== STATUS.SUCCESS) {
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
</style>
