<template>
  <router-link :to="to" class="link">
    {{ label }}
  </router-link>
</template>

<script>
export default {
  name: "Link",
  props: {
    label: {
      type: String,
      required: true,
    },
    to: {
      type: String,
    },
  },
};
</script>

<style scoped>
.link {
  text-decoration: none !important;
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--grey-color) !important;
}

.link:hover {
  color: white !important;
  cursor: pointer;
}

.link.router-link-active {
  color: white !important;
}
</style>
