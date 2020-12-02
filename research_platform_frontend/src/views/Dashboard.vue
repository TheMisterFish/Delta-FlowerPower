<template>
  <v-container fill-height class="pa-8 align-start">
    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-card flat>
              <v-card-title>Flower map</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="recentResearchesHeaders"
              :items="recentResearches"
              hide-default-footer
            ></v-data-table>
          </v-col>
          <v-col cols="12">
            <v-data-table hide-default-footer></v-data-table>
          </v-col>
        </v-row>
        <form>
          <v-file-input
            v-model="files"
            multiple
            label="File input"
          ></v-file-input>
          <input type="submit" @click.prevent="upload" />
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from 'axios'
export default {
  name: "Dashboard",
  data: () => ({
    drawer: false,
    recentResearches: [],
    recentResearchesHeaders: [],
    files: [],
  }),
  methods: {
    upload() {
      const results = [];
      const data = new FormData();

      const research = {};

      this.files.forEach((f) => {
        results.push({
          file: {
            fileName: f.name,
          },
          boundingBoxes: [{ x1: 50, y1: 50, x2: 75, y2: 75 }, {x1: 100, y1: 100, x2: 150, y2: 150}, {x1: 500, y1: 500, x2: 800, y2: 800}, {x1: 800, y1: 500, x2: 820, y2: 520}],
        });
        data.append("files", f);
      });

      research.name = "a cool name!";
      research.results = JSON.stringify(results);

      data.append("name", research.name);
      data.append("results", research.results);

      Axios({
        url: "http://localhost:7080/sessions/5fc7da2729089400114b12b2",
        method: "PUT",
        data: data,
      });
    },
  },
};
</script>
