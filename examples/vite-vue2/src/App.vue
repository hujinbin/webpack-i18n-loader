<template>
  <div class="container">
    <div class="language-switcher">
      <button @click="switchLanguage" class="lang-btn">
        {{ $i18n.locale === 'zh' ? '中文' : 'English' }}
      </button>
    </div>
    
    <h1>Vite + Vue 2 国际化示例 </h1>
    <p>这是一个测试文本</p>
    <button @click="count++">点击计数: {{ count }}</button>
    <p>当前语言: {{ $i18n.locale }}</p>
    
    <div class="demo-section">
      <h2>功能演示</h2>
      <ul>
        <li>自动识别中文并生成键值对</li>
        <li>支持语言切换功能</li>
        <li>兼容 Vue 2 和 Vite</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    switchLanguage() {
      const newLocale = this.$i18n.locale === 'zh' ? 'en' : 'zh';
      this.$i18n.locale = newLocale;
      localStorage.setItem('locale', newLocale);
    }
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
}

.lang-btn {
  padding: 8px 16px;
  border: 1px solid #646cff;
  background: transparent;
  color: #646cff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.lang-btn:hover {
  background: #646cff;
  color: white;
}

button {
  padding: 10px 20px;
  margin: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #f0f0f0;
}

.demo-section {
  margin-top: 30px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.demo-section ul {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  list-style-type: disc;
  padding-left: 40px;
}

.demo-section li {
  margin: 10px 0;
  line-height: 1.5;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

h2 {
  color: #666;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}
</style>