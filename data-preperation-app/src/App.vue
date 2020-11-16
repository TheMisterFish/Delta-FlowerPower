<template>
  <v-app>
    <v-main>
      <v-btn id="clickme" @click="openScript">
        Click me
      </v-btn>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),

  methods: {
    openScript() {
      console.log("open me!")
    }
  }
};
</script>
