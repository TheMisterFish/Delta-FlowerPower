<template>
  <div>
    <p class="subtitle-2 text-center">Locatie instellingen</p>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>

    <small><a href="#" @click="downloadLocations">Download locaties</a></small>
    <v-progress-linear
      v-if="downloading"
      indeterminate
      color="primary"
    ></v-progress-linear>

    <div class="scroll-box">
      <v-list two-line>
        <v-list-item-group
          v-model="selected"
          active-class="primary--text"
          single
        >
          <template v-for="(research, index) in researches.researches">
            <v-list-item :key="research._id">
              <template>
                <v-list-item-content>
                  <v-list-item-title v-text="research.name"></v-list-item-title>

                  <!-- <v-list-item-subtitle
                    class="text--primary"
                    v-text="research.name"
                  ></v-list-item-subtitle> -->

                  <v-list-item-subtitle
                    v-text="research.description"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-list-item>

            <v-divider v-if="index < researches.length - 1" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SelectResearchSettings",
  props: {
    research_settings: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      downloading: false,
      search: "",
      selected: 2,
    };
  },
  computed: {
    filtered_items: function() {
      return this.items.filter((i) => {
        return i.title.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    ...mapState(["researches"]),
  },
  methods: {
    downloadLocations() {
      this.downloading = true;
    },
  },
};
</script>

<style lang="css" scoped>
.scroll-box {
  height: 480px;
  overflow-y: scroll;
}
</style>
