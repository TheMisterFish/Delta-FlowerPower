<template>
  <div class="table">
    <slot name="header"></slot>
    <slot name="row"></slot>
  </div>
</template>

<script>
export default {
  name: "Table",
};
</script>

<style scoped>
.table {
  border-collapse: collapse;
  width: 100%;
  font-family: "Roboto";
  color: var(--grey-dark-color);
}

.table th {
  padding: 0px 5px 10px 5px;
  text-align: left;
  font-weight: 400;
  font-family: "Roboto";
}

.table tr {
  display: flex;
  flex: 1;
  justify-content: space-between;
  border-bottom: 1px solid var(--grey-color);
}

.table tr:first-of-type {
  border-bottom: 2px solid var(--grey-color);
}

.table td {
  padding: 10px 5px;
}
</style>
