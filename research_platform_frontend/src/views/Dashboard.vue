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

      data.append("name", "I NAME YOU")
      data.append("description", "a new description");
      data.append("research", "5fda20ab2e0c59001387bece");
      data.append("aimodel", "5fda1e668d3ed80012c567a3");
      data.append("results", JSON.stringify(results));

      Axios({
        url: "http://localhost:7080/sessions",
        method: "POST",
        data: data,
      });
    },

  }
};
</script>
