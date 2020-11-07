<template>
  <div class="snackbar-container">
    <div ref="snackbar" class="snackbar">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Snackbar",
  data() {
    return {
      message: "",
      snackbarTimeout: null,
      visible: false,
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "showSnackbar") {
        if (this.visible) {
          clearTimeout(this.snackbarTimeout);
        }

        this.message = state.snackbar.message;
        this.$refs.snackbar.classList.remove("snackbar-animation-out");
        this.$refs.snackbar.classList.add("snackbar-animation-in");
        this.visible = true;
        this.snackbarTimeout = setTimeout(() => {
          this.$refs.snackbar.classList.remove("snackbar-animation-in");
          this.$refs.snackbar.classList.add("snackbar-animation-out");
          this.visible = false;
        }, 4000);
      }

      if (mutation.type === "hideSnackbar" && this.visible) {
        clearTimeout(this.snackbarTimeout);
        this.$refs.snackbar.classList.remove("snackbar-animation-in");
        this.$refs.snackbar.classList.add("snackbar-animation-out");
        this.visible = false;
      }
    });
  },
};
</script>

<style scoped>
.snackbar-container {
  position: absolute;
  overflow: hidden;
  bottom: 15px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.snackbar {
  max-height: 0px;
  overflow: hidden;
  padding: 18px;
  border-radius: 5px;
  opacity: 0;
  background-color: #bd7777;

  transform: translateY(30px);
}

.snackbar-animation-in {
  animation-name: fadein;
  animation-duration: 0.3s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
}

.snackbar-animation-out {
  animation-name: fadeout;
  animation-duration: 0.3s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
}

@keyframes fadein {
  50% {
    max-height: 50px;
  }
  to {
    margin-bottom: 10px;
    transform: translateY(0px);
    max-height: 50px;
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    margin-bottom: 10px;
    transform: translateY(0px);
    max-height: 50px;
    opacity: 1;
  }
  50% {
    max-height: 50px;
  }
}
</style>
