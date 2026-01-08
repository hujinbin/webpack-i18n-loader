<template>
  <div class="form-container">
    <h1>用户注册表单</h1>
    
    <div class="form-group">
      <label>姓名</label>
      <input type="text" v-bind:placeholder="'请输入姓名'" v-model="name">
    </div>
    
    <div class="form-group">
      <label>邮箱</label>
      <input type="email" v-bind:placeholder="'请输入邮箱地址'" v-model="email">
    </div>
    
    <div class="form-group">
      <label>密码</label>
      <input type="password" v-bind:placeholder="'请输入密码'" v-model="password">
    </div>
    
    <div class="form-group">
      <label>备注</label>
      <textarea :placeholder="textareaPlaceholder" v-model="notes"></textarea>
    </div>
    
    <div class="form-group">
      <select v-model="city">
        <option value="">请选择城市</option>
        <option value="bj">北京</option>
        <option value="sh">上海</option>
        <option value="gz">广州</option>
      </select>
    </div>
    
    <button @click="submit">提交</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      notes: '',
      city: '',
      textareaPlaceholder: '请输入备注信息'
    };
  },
  methods: {
    submit() {
      if (!this.name) {
        alert('请输入姓名');
        return;
      }
      console.log('表单提交成功');
    },
    reset() {
      const msg = '确定要重置表单吗？';
      if (confirm(msg)) {
        console.log('表单已重置');
      }
    }
  }
};
</script>
