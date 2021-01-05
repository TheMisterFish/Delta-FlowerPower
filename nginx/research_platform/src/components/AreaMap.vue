<template>
  <gmap-map
    ref="gmap"
    :center="center"
    :zoom="9.5"
    style="width: 100%; height: 100%;"
    :options="{ streetViewControl: false, mapTypeControl: false }"
  >
    <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      @click="center = m.position"
    ></gmap-marker>
  </gmap-map>
</template>

<script>
import { gmapApi } from "gmap-vue";

export default {
  name: "AreaMap",
  data: () => ({
    // default to Montreal to keep it simple
    // change this to whatever makes sense
    center: { lat: 52.370216, lng: 4.895168 },
    markers: [],
    lastOverlay: null,
    map: null,
    reset: false,
    polygonListener: null,
  }),
  props: {
    angle: Number,
    resetAngle: Function,
    updateCoordinates: Function
  },
  computed: {
    google: gmapApi,
  },
  watch: {
    angle(newAngle, oldAngle) {
      if (this.lastOverlay && !this.reset)
        this.rotatePolygon(this.lastOverlay, newAngle - oldAngle);
      this.reset = false;
    },
  },
  mounted: function() {
    let self = this;
    this.$nextTick(() => {
      self.$refs.gmap.$mapPromise.then((map) => {
        self.map = map;

        const drawingManager = new this.google.maps.drawing.DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: self.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [self.google.maps.drawing.OverlayType.RECTANGLE],
          },
        });

        drawingManager.setMap(map);

        self.google.maps.event.addListener(
          drawingManager,
          "overlaycomplete",
          function(event) {
            drawingManager.setDrawingMode(null);
            event.overlay.setMap(null);
            if (self.lastOverlay) { 
              self.resetAngle();
              self.reset = true;
              self.google.maps.event.removeListener(self.polygonListener);
              self.lastOverlay.setMap(null);
            }
            const polygon = self.generatePolygonFromRectangle(event.overlay);
            self.polygonListener = self.google.maps.event.addListener(polygon, "dragend", (event) => {
              self.updateCoordinates(self.getPolygonPoints());
            })
            polygon.setMap(map);
            self.lastOverlay = polygon;
          }
        );
      });
    });
  },
  methods: {
    generatePolygonFromRectangle(rectangle) {
      const coordinates = [
        {
          lat: rectangle
            .getBounds()
            .getNorthEast()
            .lat(),
          lng: rectangle
            .getBounds()
            .getNorthEast()
            .lng(),
        },
        {
          lat: rectangle
            .getBounds()
            .getNorthEast()
            .lat(),
          lng: rectangle
            .getBounds()
            .getSouthWest()
            .lng(),
        },
        {
          lat: rectangle
            .getBounds()
            .getSouthWest()
            .lat(),
          lng: rectangle
            .getBounds()
            .getSouthWest()
            .lng(),
        },
        {
          lat: rectangle
            .getBounds()
            .getSouthWest()
            .lat(),
          lng: rectangle
            .getBounds()
            .getNorthEast()
            .lng(),
        },
      ];

      this.updateCoordinates(coordinates);

      return new this.google.maps.Polygon({
        path: coordinates,
        draggable: true,
      });
    },

    getPolygonPoints() {
      return [
        {
          lat: this.lastOverlay
            .getPath()
            .getArray()[0]
            .lat(),
          lng: this.lastOverlay
            .getPath()
            .getArray()[0]
            .lng(),
        },
        {
          lat: this.lastOverlay
            .getPath()
            .getArray()[1]
            .lat(),
          lng: this.lastOverlay
            .getPath()
            .getArray()[1]
            .lng(),
        },
        {
          lat: this.lastOverlay
            .getPath()
            .getArray()[2]
            .lat(),
          lng: this.lastOverlay
            .getPath()
            .getArray()[2]
            .lng(),
        },
        {
          lat: this.lastOverlay
            .getPath()
            .getArray()[3]
            .lat(),
          lng: this.lastOverlay
            .getPath()
            .getArray()[3]
            .lng(),
        },
      ];
    },

    rotatePolygon(polygon, angle) {
      const projection = this.map.getProjection();
      const bounds = new this.google.maps.LatLngBounds();

      polygon
        .getPath()
        .getArray()
        .forEach((latLng) => {
          bounds.extend(latLng);
        });

      const origin = projection.fromLatLngToPoint(bounds.getCenter());

      const self = this;
      const coordinates = polygon
        .getPath()
        .getArray()
        .map(function(latLng) {
          const point = projection.fromLatLngToPoint(latLng);
          const rotatedLatLng = projection.fromPointToLatLng(
            self.rotatePoint(point, origin, angle)
          );
          return { lat: rotatedLatLng.lat(), lng: rotatedLatLng.lng() };
        });

      this.updateCoordinates(coordinates);

      polygon.setPath(coordinates);
    },

    rotatePoint(point, origin, angle) {
      const angleRad = (angle * Math.PI) / 180.0;
      return {
        x:
          Math.cos(angleRad) * (point.x - origin.x) -
          Math.sin(angleRad) * (point.y - origin.y) +
          origin.x,
        y:
          Math.sin(angleRad) * (point.x - origin.x) +
          Math.cos(angleRad) * (point.y - origin.y) +
          origin.y,
      };
    },
  },
};
</script>
