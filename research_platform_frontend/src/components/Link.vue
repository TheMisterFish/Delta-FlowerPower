<template>
  <router-link :to="to" class="link">
    {{ label }}
  </router-link>
</template>

<script lang="ts">
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
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--grey-color);
}

.link:hover {
  color: white;
  cursor: pointer;
}

.link.router-link-active {
  color: white;
}
</style>
