<template>
  <div id="dashboard">
    <v-container class="mb-5">
      <v-row>
        <v-col cols="12" sm="12">
          <h3 class="text-center">Nieuw onderzoek.</h3>
        </v-col>
        <v-col cols="6" sm="6">
          <v-btn
            class="big-button no-text-transform text-center"
            to="create_drone_research"
            block
          >
            <span
              style="
                                white-space: normal;
                                word-wrap: break-word;
                                width: 90%;
                                padding: 10%;
                            "
            >
              <v-icon color="primary" x-large>mdi-quadcopter</v-icon>
              <br /><br />
              Onderzoek met drone uitvoeren.
            </span>
          </v-btn>
        </v-col>
        <v-col cols="6" sm="6">
          <v-btn
            class="big-button no-text-transform text-center"
            @click="selectInputFolder"
            block
          >
            <span
              style="
                                white-space: normal;
                                word-wrap: break-word;
                                width: 90%;
                                padding: 10%;
                            "
            >
              <v-icon color="primary" x-large>mdi-micro-sd</v-icon>
              <br /><br />
              Foto's van SD kaart gebruiken.
            </span>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider style="padding-bottom: 10px"></v-divider>

      <v-row>
        <v-col cols="12" sm="12">
          <h3 class="text-center">Uitgevoerde onderzoeken.</h3>
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            v-model="search_prev_research"
            append-icon="mdi-magnify"
            label="Zoeken"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <performed-research
            v-for="(research, index) in researches"
            :key="index"
            :research="research"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-btn class="settings_button" color="primary" fab dark to="settings">
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Vue from "vue";
import { IPC_MESSAGES, IPC_CHANNELS } from "../constants.js";
import { IpcMessage } from "../IpcMessage.js";
import { mapState } from "vuex";
import { LocalDatabaseActions } from "../actions";
import PerformedResearch from "../components/PerformedResearch";

export default Vue.extend({
  name: "dashboard",
  components: {
    PerformedResearch,
  },
  data() {
    return {
      search_prev_research: null,
      researches: [],
    };
  },
  async mounted() {
    this.researches = await LocalDatabaseActions.getLocalResearches();
  },
  methods: {
    async selectInputFolder() {
      const ipcMessage = new IpcMessage(IPC_MESSAGES.SELECT_FOLDER);
      const response = await window.electron.invoke(
        IPC_CHANNELS.FILESYSTEM,
        ipcMessage
      );

      if (response !== undefined) {
        this.$store.dispatch("setPath", response);
        this.$router.push("/create_sd_research");
      }
    },
  },
});
</script>

<style lang="css">
.big-button {
  width: 100%;
  height: 100%;
  min-height: 150px;
  min-width: 200px;
}

.card-spacer {
  margin-bottom: 20px;
}

.v-btn__content {
  width: 100%;
}
.settings_button {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>
