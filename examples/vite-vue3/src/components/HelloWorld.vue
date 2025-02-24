<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    看看
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, 官方Vue + Vite启动器
  </p>
  <p>
    中了解更多关于IDE对Vue的支持
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue文档扩展指南</a
    >.
  </p>
  <p class="read-the-docs">点击Vite和Vue徽标了解更多信息</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
