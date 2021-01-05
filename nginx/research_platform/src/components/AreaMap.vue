<template>
  <gmap-map :center="center" :zoom="9.5" style="width: 100%; height: 100%;">
    <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      @click="center = m.position"
    ></gmap-marker>
  </gmap-map>
</template>

<script>
export default {
  name: "AreaMap",
  data: () => ({
    // default to Montreal to keep it simple
    // change this to whatever makes sense
    center: { lat: 52.370216, lng: 4.895168 },
    markers: [],
    places: [],
    currentPlace: null,
  }),
};
</script>
