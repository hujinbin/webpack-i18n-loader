<template>
  <div class="container">
    <div class="language-switcher">
      <button @click="switchLanguage">
        {{ locale === 'zh' ? '切换到英文' : 'English' }}
      </button>
    </div>
    
    <h1>Vue 国际化示例</h1>
    <p>这是一个复杂的组件示例</p>
    <button @click="count++">点击次数：{{ count }}</button>
    <p>当前语言：{{ locale }}</p>
    
    <div class="demo-section">
      <h2>功能列表</h2>
      <ul>
        <li>支持多语言切换</li>
        <li>支持动态内容</li>
        <li>支持表单验证</li>
      </ul>
    </div>
    
    <div class="form-section">
      <input v-bind:placeholder="'请输入用户名'" v-model="username">
      <input v-bind:placeholder="'请输入逻辑'" v-model="logic">
      <button>提交</button>
    </div>
    
    <div class="message-list">
      <div v-for="(item, index) in messages" :key="index">
        <span>{{ item.title }}</span>
        <p>{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      locale: 'zh',
      username: '',
      logic: '',
      messages: [
        { title: '系统消息', content: '欢迎使用系统' },
        { title: '通知消息', content: '你有新的消息' },
        { title: '警告消息', content: '请注意安全' }
      ]
    };
  },
  methods: {
    switchLanguage() {
      const status = '切换成功';
      console.log('语言切换：' + status);
      alert('语言已切换');
    }
  },
};
</script>
