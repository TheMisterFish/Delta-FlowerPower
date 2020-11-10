<template>
  <div class="input">
    <input v-model="inputValue" :type="type" placeholder="" />
    <label>{{ label }}</label>
    <fieldset>
      <legend><span></span></legend>
    </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Input",
  props: {
    label: String,
    type: {
      type: String,
      default: "text",
    },
    value: String,
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      },
    },
  },
});
</script>

<style scoped>
.input {
  position: relative;

  display: flex;
  align-items: center;
  margin-bottom: 25px;

  width: 70%;
}

.input input {
  border: none;
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-family: inherit;
  color: rgb(50, 50, 50);
  outline: none;
}

.input label {
  z-index: 1;
  position: absolute;
  transform: translate(10px, 0px);
  padding: 0px 5px;
  background-color: white;
  color: rgb(50, 50, 50);

  transition: transform 0.15s ease-in-out, font-size 0.15s ease-in-out;
}

.input label {
  pointer-events: none;
}

.input:focus-within label,
.input input:not(:placeholder-shown) + label {
  transform: translate(10px, -24px);
  font-size: 0.75rem;
}

.input fieldset {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  border: 1px solid rgb(150, 150, 150);
  border-radius: 5px;

  margin: 0px;

  pointer-events: none;
}

.input fieldset legend {
  padding: 0px;
}

.input:hover fieldset {
  border-color: rgb(80, 80, 80);
}

.input:focus-within fieldset {
  border: 2px solid var(--primary-color);
}
</style>
