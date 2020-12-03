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

    <small
      ><a
        href="#"
        @click="downloadLocations"
        >Download locaties</a
      ></small
    >
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
                  <v-list-item-title v-text="item.title"></v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.headline"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="item.subtitle"
                  ></v-list-item-subtitle>
                </v-list-item-content>
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
export default {
  name: "SelectLocationSettings",
  props: {
    location_settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      downloading: false,
      search: "",
      selected: 2,
      items: [
        {
          action: "15 min",
          headline: "Brunch this weekend?",
          subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
          title: "Ali Connosfsrs",
        },
        {
          action: "2 hr",
          headline: "Summer BBQ",
          subtitle: `Wish I could come, but I'm out of town this weekend.`,
          title: "me, Scrowertbt, Jennifer",
        },
        {
          action: "6 hr",
          headline: "Oui oui",
          subtitle: "Do you have Paris recommendations? Have you ever been?",
          title: "Sandra rewAdvams",
        },
        {
          action: "12 hr",
          headline: "Birthday gift",
          subtitle:
            "Have any ideas about what we should get Heidi for her birthday?",
          title: "Trevor bvcHanasen",
        },
        {
          action: "18hr",
          headline: "Recipe to try",
          subtitle:
            "We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
          title: "Brittazxc Holta",
        },
        {
          action: "12 hr",
          headline: "Birthday gift",
          subtitle:
            "Have any ideas about what we should get Heidi for her birthday?",
          title: "Trevorawda Haxnsen",
        },
        {
          action: "18hr",
          headline: "Recipe to try",
          subtitle:
            "We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
          title: "Britta xHolt",
        },
      ],
    };
  },
  computed: {
    filtered_items: function () {
      return this.items.filter((i) => {
        return i.title.toLowerCase().includes(this.search.toLowerCase());
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
