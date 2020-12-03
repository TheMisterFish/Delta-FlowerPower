<template>
  <div>
    <p class="subtitle-2 text-center">Locatie instellingen</p>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Zoeken"
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
          <template v-for="(item, index) in filtered_items">
            <v-list-item :key="item.id">
              <template>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.pos_1"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="item.description"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text>
                    {{ item.made_by.name }}
                  </v-list-item-action-text>
                  <v-list-item-action-text>
                    {{ item.created_at | dateTime }}
                  </v-list-item-action-text>
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </div>
  </div>
</template>

<script>
// import moment from 'moment';
export default {
  name: "SelectLocationSettings",
  props: {
    location_settings: {
      type: Object,
      required: true,
    },
  },
  filters: {
    dateTime: function (thing) {
      return window.moment().format( 'LLL' );
    },
  },
  data() {
    return {
      downloading: false,
      search: "",
      selected: 2,
      items: [
        {
          _id: "awlkdjawld-2893u1289321-kladjwkldjawd",
          name: "Nep Locatie",
          description: "New descriptie",
          pos_1: "5.342546,56.234543",
          pos_2: "5.543215,56.987456",
          created_at: new Date(),
          made_by: {
            name: "jaap",
          },
        },
      ],
    };
  },
  computed: {
    filtered_items: function () {
      return this.items.filter((i) => {
        return i.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
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
