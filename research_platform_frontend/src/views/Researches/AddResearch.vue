<template>
  <v-container class="pa-8 align-start fill-height">
    <v-row>
      <v-col cols="12">
        <v-card class="fill-height px-8">
          <v-row>
            <v-col cols="12">
              <v-text-field
                outlined
                v-model="name"
                label="Name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                outlined
                v-model="description"
                label="Description"
                auto-grow
              >
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="area_ids"
                :items="areas.areas"
                chips
                multiple
                item-text="name"
                item-value="_id"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-btn @click="addResearch" color="primary">Add Research</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { STATUS } from '../../store/storeResponse';
export default {
  name: "AddResearch",
  data: () => ({
    name: "",
    description: "",
    area_ids: [],
  }),
  computed: {
    ...mapState(["areas"]),
  },
  methods: {
    async addResearch() {
      const response = await this.$store.dispatch("addResearch", {name: this.name, description: this.description});
      console.log(response);

      if(response.status === STATUS.SUCCESS) {
        console.log("YEAH!");
      } else {
        console.log("WE GOT AN ERRROR");
      }
    },
  },
  created: async function() {
    await this.$store.dispatch("getAreas");
  },
};
</script>
