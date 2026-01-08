<template>
  <div class="list-container">
    <h1>{{$t("520543078f0303ed")}}</h1>
    
    <div class="toolbar">
      <button @click="addTask">{{$t("482d9d71fa7deda1")}}</button>
      <button @click="clearCompleted">{{$t("135504cc6816419a")}}</button>
    </div>
    
    <div class="task-stats">
      <span>{{$t("1e6583b786c64864")}}{{ tasks.length }}</span>
      <span>{{$t("5657a6d23cb2cef5")}}{{ completedCount }}</span>
      <span>{{$t("b6caf64a3e554083")}}{{ pendingCount }}</span>
    </div>
    
    <ul class="task-list">
      <li v-for="(task, index) in tasks" :key="task.id">
        <input type="checkbox" v-model="task.completed">
        <span :class="{ completed: task.completed }">{{ task.title }}</span>
        <span class="priority">{{$t("38ff2dbd03417e41")}}{{ task.priority }}</span>
        <button @click="editTask(index)">{{$t("95b351c86267f3ae")}}</button>
        <button @click="deleteTask(index)">{{$t("2f4aaddde33c9b93")}}</button>
      </li>
    </ul>
    
    <div class="empty-state" v-if="tasks.length === 0">
      <p>{{$t("0589e591b5a70d7e")}}</p>
      <p>{{$t("f1b015ec8b76faf1")}}</p>
    </div>
    
    <div class="filters">
      <button @click="filter = 'all'">{{$t("a8b0c20416853bda")}}</button>
      <button @click="filter = 'active'">{{$t("fb852fc6cce16830")}}</button>
      <button @click="filter = 'completed'">{{$t("fad5222ca0acfaee")}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        { id: 1, title: $t('aa4bef9b5b0c4336'), completed: false, priority: $t('4296d7d293c9ea4a') },
        { id: 2, title: $t('89d9f58109158f32'), completed: true, priority: $t('aed1dfbc31703955') },
        { id: 3, title: $t('77e43e3e398c97e9'), completed: false, priority: $t('cb0ed5ef5f2f4103') }
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
      const title = prompt($t('2daf3a89940cb931'));
      if (title) {
        console.log($t('f4f5deac7a820f92'));
      }
    },
    editTask(index) {
      alert($t('9ef9f615177b0207'));
    },
    deleteTask(index) {
      if (confirm($t('0b6d7067ac34e553'))) {
        this.tasks.splice(index, 1);
        console.log($t('b2ae04aaf6d4e413'));
      }
    },
    clearCompleted() {
      const msg = $t('b16dc5c69e5ee874');
      if (confirm(msg)) {
        this.tasks = this.tasks.filter(t => !t.completed);
        console.log($t('470cd0deea78cce3'));
      }
    }
  }
};
</script>
