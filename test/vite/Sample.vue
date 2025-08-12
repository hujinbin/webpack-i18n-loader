<template>
  <div class="sample-component">
    <h1>测试文本</h1>
    <p>你好世界</p>
    <button @click="handleClick">保存成功</button>
    <div :title="message">这是一个测试</div>
    <span>{{ dynamicMessage }}</span>
  </div>
</template>

<script>
export default {
  name: 'Sample',
  data() {
    return {
      message: '欢迎使用',
      dynamicMessage: '动态消息: ' + '测试文本'
    }
  },
  methods: {
    handleClick() {
      this.$message.success('保存成功');
      console.log('你好世界');
    },
    showAlert() {
      alert('这是一个测试');
    }
  }
}
</script>

<style scoped>
.sample-component {
  padding: 20px;
}
</style>