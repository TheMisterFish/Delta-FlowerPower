<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card v-if="area" flat>
          <v-card-title class="mb-4"
            >{{ area.name }}<v-spacer></v-spacer>
            <v-btn disabled color="primary">Save</v-btn>
          </v-card-title>
          <v-card-subtitle>{{ area.description }}</v-card-subtitle>
          <v-card-actions>
            <v-btn @click="deleteArea" text color="error">
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
export default {
  name: "Area",
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
