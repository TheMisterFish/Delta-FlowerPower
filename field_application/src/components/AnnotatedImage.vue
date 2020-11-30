<template>
  <div>
    <canvas class="canvas" ref="canvas" width="4056" height="2080"></canvas>
  </div>
</template>
<script>

export default {
  name: "AnnotatedImage",
  props: ["imagePath", "boundingBoxes"],
  data: () => ({
    imageWidth: 0,
    imageHeight: 0,
    canvasObserver: null,
    canvasImage: null,
    ratioX: 0,
    ratioY: 0,
    scaleX: 0,
    scaleY: 0,
  }),
  watch: {
    boundingBoxes: function(newValue, oldValue) {
      this.drawBoundingBoxes();
    }
  },
  methods: {
    resizeCanvas() {
      const canvas = this.$refs.canvas;
      this.ratioX = canvas.clientWidth / this.imageWidth;
      this.ratioY = canvas.clientHeight / this.imageHeight;

      this.scaleX = canvas.width / canvas.clientWidth;
      this.scaleY = canvas.height / canvas.clientHeight;

      //REDRAW THE BOXES
      this.drawBoundingBoxes();
    },

    drawBoundingBoxes() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      const self = this;

      context.clearRect(
        0,
        0,
        canvas.clientWidth * this.scaleX,
        canvas.clientHeight * this.scaleY
      );

      context.drawImage(
        self.canvasImage,
        0,
        0,
        self.canvasImage.width,
        self.canvasImage.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.lineWidth = "6";
      context.strokeStyle = "pink";

      this.boundingBoxes.forEach((b) => {
        const x = b.x1 * self.ratioX;
        const y = b.y1 * self.ratioY;

        const w = (b.x2 - b.x1) * self.ratioX;
        const h = (b.y2 - b.y1) * self.ratioY;
        context.strokeRect(x*this.scaleX, y*this.scaleY, w*this.scaleX, h*this.scaleY);
      });
    },
  },
  mounted: function() {
    const canvas = this.$refs.canvas;
    const context = canvas.getContext("2d");
    this.canvasImage = new Image();
    const self = this;
    this.canvasImage.onload = function() {
      self.imageWidth = self.canvasImage.width;
      self.imageHeight = self.canvasImage.height;
      console.log(canvas.width, canvas.height)
      context.drawImage(
        self.canvasImage,
        0,
        0,
        self.canvasImage.width,
        self.canvasImage.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      self.canvasObserver = new ResizeObserver(self.resizeCanvas);

      self.canvasObserver.observe(self.$refs.canvas, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    };
    this.canvasImage.src = this.imagePath;
  },
  beforeDestroy() {
    this.canvasObserver.disconnect();
  },
};
</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
