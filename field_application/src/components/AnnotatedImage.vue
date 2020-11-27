<template>
<div>
  <canvas @click="me" class="canvas" ref="canvas"></canvas>
  {{boundingBoxes}}
</div>
</template>
<script>
//TODO 
//original image width / canvas width = width ratio
//original image height / canvas height = height ratio

//when placing bounding boxes we need to divide the x and y by the width ratio and height ratio respectively

export default {
  name: "AnnotatedImage",
  props: ["imagePath", "boundingBoxes"],
  methods: {
    me() {
      console.log(this.imagePath, this.boundingBoxes)
    }
  },
  mounted: function() {
    const canvas = this.$refs.canvas;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.onload = function() {
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    };
    image.src = this.imagePath;
  },
};
</script>

<style scoped>
.canvas {
    width: 100%;
    height: 100%;
}
</style>
