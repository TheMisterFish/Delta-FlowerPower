<template>
  <v-app>
    <v-main>

      <v-container fluid style="padding: 0">
        <router-view></router-view>
      </v-container>
    </v-main>
    <alert />
  </v-app>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");

:root {
  --primary-color: #567a58;
  --primary-grey-color: #d4d4d4;
}

html {
  font-size: 16px;
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}
</style>
