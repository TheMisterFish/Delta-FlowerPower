<template>
  <div class="snackbar">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "Snackbar",
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
