<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12">
        <v-card v-if="area" flat>
          <v-row>
            <v-col cols="12">
              <v-card-title class="pb-0"
                >{{ area.name }}
                <v-spacer></v-spacer>
                <v-btn color="primary">Edit</v-btn>
              </v-card-title>
            </v-col>
            <v-col cols="12">
              <v-card-subtitle class="pt-0">{{ area.description }}</v-card-subtitle>
            </v-col>
            <v-col style="min-height: 400px;" class="px-8" cols="12">
              <AreaMap />
            </v-col>
            <v-col cols="12">
              <v-card-actions>
                <v-btn @click="deleteArea" text color="error">
                  Delete
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import AreaMap from "../components/AreaMap.vue";
export default {
  name: "Area",
  components: {
    AreaMap,
  },
  computed: {
    ...mapState(["areas"]),
    area: function() {
      if (!this.areas.areas) {
        return null;
      }

      const id = this.$route.params.id;

      return this.areas.areas.find((area) => (area._id = id));
    },
  },
  methods: {
    deleteArea() {
      const _id = this.area._id;
      this.$store
        .dispatch("deleteArea", _id)
        .then(() => {
          console.log("area deleted!");
          this.$router.push({ name: "areas" });
        })
        .catch((error) => {
          console.log("error :-(", error);
        });
    },
  },
};
</script>
