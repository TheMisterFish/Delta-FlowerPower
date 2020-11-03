<template>
  <div>
    <router-view />
    <Snackbar/>
  </div>
</template>

<script>
import Snackbar from "./components/Snackbar.vue"
export default {
  name: "App",
  components: {
    Snackbar
  }
};
</script>


<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");

:root {
  --primary-color: #567a58;
  --primary-grey-color: #d4d4d4;
  --jiggle-distance-big: 4px;
  --jiggle-distance-small: 2px;
}

html {
  font-size: 16px;
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
  overflow: hidden;
}

#snackbar-container {
  position: absolute;
  bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  pointer-events: none;
}
</style>
