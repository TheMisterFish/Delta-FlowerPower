<template>
  <button class="floating-action-button">
    <Plus class="add-icon" /><span>{{label}}</span>
  </button>
</template>

<script>
import Plus from "vue-material-design-icons/Plus.vue";

export default {
  name: "FloatingActionButton",
  components: {
    Plus,
  },
  props: {
    label: String
  }
};
</script>

<style scoped>
.floating-action-button {
  z-index: 1;
  position: fixed;
  right: calc(var(--page-padding) + 25px);
  bottom: calc(25px);

  display: flex;
  align-items: center;

  box-shadow: 0px 2px 5px 1px var(--card-box-shadow-color);

  border: none;
  border-radius: 25px;
  padding: 12px 16px;
  background-color: var(--primary-color);
  color: white;
  font-family: "Roboto";
  font-weight: 500;
  text-transform: uppercase;

  transition: background-color 0.1s ease;
}

.floating-action-button:hover {
  background-color: var(--primary-dark-color);
  cursor: pointer;
}

.floating-action-button .add-icon {
  display: flex;
}
</style>
