<template>
  <div id="dashboard">
    <v-container>
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
          <h3 class="text-center">Vorige onderzoeken.</h3>
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            v-model="search_prev_research"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <v-card class="mx-auto card-spacer">
            <v-card-text>
              <div>Word of the Day</div>
              <div class="text--primary">
                relating to or dependent on charity; charitable.<br />
                "an eleemosynary educational institution."
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary accent-4">
                Bekijk data en opties
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card class="mx-auto card-spacer">
            <v-card-text>
              <div>Word of the Day</div>
              <div class="text--primary">
                relating to or dependent on charity; charitable.<br />
                "an eleemosynary educational institution."
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary accent-4">
                Bekijk data en opties
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card class="mx-auto card-spacer">
            <v-card-text>
              <div>Word of the Day</div>
              <div class="text--primary">
                relating to or dependent on charity; charitable.<br />
                "an eleemosynary educational institution."
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary accent-4">
                Bekijk data en opties
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";
import { mdiMicroSd, mdiQuadcopter } from "@mdi/js";
import { FILESYSTEM, IPC_MESSAGES, DETECT_IMAGES } from "../constants.js";
import { IpcMessage } from "../IpcMessage.js";
import { mapState } from "vuex";

export default Vue.extend({
  name: "dashboard",
  data() {
    return {
      search_prev_research: null,
    };
  },
  methods: {
    async selectInputFolder() {
      const ipcMessage = new IpcMessage(IPC_MESSAGES.SELECT_FOLDER);
      const response = await window.electron.invoke(FILESYSTEM, ipcMessage);
      this.$store.dispatch("setPath", response);
      this.$router.push("/create_sd_research")
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
</style>
