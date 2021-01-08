<template>
  <v-card class="mx-auto card-spacer">
    <div class="row">
      <div class="col-4">
        <v-card-text>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Onderzoek:</v-list-item-title>
              <v-list-item-subtitle>
                {{ research.research_settings.research.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Locatie:</v-list-item-title>
              <v-list-item-subtitle>
                {{ research.research_settings.research.location.name }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ research.research_settings.research.location.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </div>
      <div class="col-4">
        <v-card-text>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Type onderzoek:</v-list-item-title>
              <v-list-item-subtitle>{{
                research.research_type
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Uitgevoerd:</v-list-item-title>
              <v-list-item-subtitle>{{
                research.executed ? research.executed_date : "Nee"
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </div>
      <div class="col-4">
        <v-card-text>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Aantal waypoints:</v-list-item-title>
              <v-list-item-subtitle>{{
                research.waypoint_settings.points.length
              }}</v-list-item-subtitle>
            </v-list-item-content> </v-list-item
          ><v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Data geupload:</v-list-item-title>
              <v-list-item-subtitle>{{
                research.uploaded == true
                  ? (research.upload_date | dateTime)
                  : "Nee"
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </div>
    </div>
    <v-card-actions class="justify-space-between">
      <v-btn text color="primary accent-4">
        Bekijk data en opties
      </v-btn>
      <div class="float-right">
        <small>Gemaakt op:</small><br />
        {{ research.create_date | dateTime }}
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from "vue";
export default {
  name: "AnnotatedImage",
  props: { research: Object },
  data: () => ({}),
  filters: {
    dateTime: function(time) {
      return window.moment(time).format("LLL");
    },
  },
};
</script>
