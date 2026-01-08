<template>
  <div class="list-container">
    <h1>任务管理列表</h1>
    
    <div class="toolbar">
      <button @click="addTask">添加任务</button>
      <button @click="clearCompleted">清除已完成</button>
    </div>
    
    <div class="task-stats">
      <span>总任务：{{ tasks.length }}</span>
      <span>已完成：{{ completedCount }}</span>
      <span>待完成：{{ pendingCount }}</span>
    </div>
    
    <ul class="task-list">
      <li v-for="(task, index) in tasks" :key="task.id">
        <input type="checkbox" v-model="task.completed">
        <span :class="{ completed: task.completed }">{{ task.title }}</span>
        <span class="priority">优先级：{{ task.priority }}</span>
        <button @click="editTask(index)">编辑</button>
        <button @click="deleteTask(index)">删除</button>
      </li>
    </ul>
    
    <div class="empty-state" v-if="tasks.length === 0">
      <p>暂无任务</p>
      <p>点击上方按钮添加新任务</p>
    </div>
    
    <div class="filters">
      <button @click="filter = 'all'">全部</button>
      <button @click="filter = 'active'">进行中</button>
      <button @click="filter = 'completed'">已完成</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        { id: 1, title: '完成项目文档', completed: false, priority: '高' },
        { id: 2, title: '代码审查', completed: true, priority: '中' },
        { id: 3, title: '修复bug', completed: false, priority: '紧急' }
      ],
      filter: 'all'
    };
  },
  computed: {
    completedCount() {
      return this.tasks.filter(t => t.completed).length;
    },
    pendingCount() {
      return this.tasks.filter(t => !t.completed).length;
    }
  },
  methods: {
    addTask() {
      const title = prompt('请输入任务标题');
      if (title) {
        console.log('任务添加成功');
      }
    },
    editTask(index) {
      alert('编辑任务功能');
    },
    deleteTask(index) {
      if (confirm('确定要删除这个任务吗？')) {
        this.tasks.splice(index, 1);
        console.log('任务已删除');
      }
    },
    clearCompleted() {
      const msg = '确定要清除所有已完成的任务吗？';
      if (confirm(msg)) {
        this.tasks = this.tasks.filter(t => !t.completed);
        console.log('已完成任务已清除');
      }
    }
  }
};
</script>
