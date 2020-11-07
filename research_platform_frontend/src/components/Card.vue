<template>
  <div class="card">
    <slot name="card-title"></slot>
    <slot name="card-body"></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: "Card",
  props: {
    title: String,
  },
};
</script>

<style scoped>
.card {
  display: inline-flex;
  flex-direction: column;
  border-radius: 5px;
  height: max-content;
  margin-bottom: 25px;
  padding: 25px;
  background-color: white;
  box-shadow: 0px 0px 5px 1px var(--card-box-shadow-color);
}

.card .card-title {
  margin-bottom: 25px;
  font-size: 1.5rem;
  color: var(--grey-dark-color);
}
</style>
