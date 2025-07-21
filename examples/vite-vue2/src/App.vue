<template>
  <div class="container">
    <h1>{{ message }}</h1>
    <button @click="count++">点击: {{ count }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Vite + Vue2',
      count: 0,
    };
  },
};
</script>

<style scoped>
.container {
  padding: 2rem;
  text-align: center;
}
</style>