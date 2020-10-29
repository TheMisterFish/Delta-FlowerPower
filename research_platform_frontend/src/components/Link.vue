<template>
  <router-link :to=to class="link">
    {{ label }}
  </router-link>
</template>

<script lang="ts">
import Vue from "vue";

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
    active: {
      type: Boolean
    }
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--primary-grey-color);
}

.link:hover {
  color: white;
  cursor: pointer;
}

.link.router-link-active {
  color: white;
}
</style>
