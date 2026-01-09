<template>
  <div class="list-container">
    <h1>{{$t("8f0303edcd09e907")}}</h1>
    
    <div class="toolbar">
      <button @click="addTask">{{$t("fa7deda1a0882c66")}}</button>
      <button @click="clearCompleted">{{$t("6816419afc58bfe5")}}</button>
    </div>
    
    <div class="task-stats">
      <span>{{$t("86c6486413eaf072")}}{{ tasks.length }}</span>
      <span>{{$t("3cb2cef59821edd2")}}{{ completedCount }}</span>
      <span>{{$t("3e5540835be0065c")}}{{ pendingCount }}</span>
    </div>
    
    <ul class="task-list">
      <li v-for="(task, index) in tasks" :key="task.id">
        <input type="checkbox" v-model="task.completed">
        <span :class="{ completed: task.completed }">{{ task.title }}</span>
        <span class="priority">{{$t("03417e41703def44")}}{{ task.priority }}</span>
        <button @click="editTask(index)">{{$t("6267f3aedf895209")}}</button>
        <button @click="deleteTask(index)">{{$t("e33c9b93c36fd250")}}</button>
      </li>
    </ul>
    
    <div class="empty-state" v-if="tasks.length === 0">
      <p>{{$t("b5a70d7e04313785")}}</p>
      <p>{{$t("8b76faf132177eba")}}</p>
    </div>
    
    <div class="filters">
      <button @click="filter = 'all'">{{$t("16853bda54120bf1")}}</button>
      <button @click="filter = 'active'">{{$t("cce168301447d1ba")}}</button>
      <button @click="filter = 'completed'">{{$t("a0acfaee54f06458")}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        { id: 1, title: $t('5b0c43369e978990'), completed: false, priority: $t('93c9ea4a0e52c641') },
        { id: 2, title: $t('09158f32d91f0bfc'), completed: true, priority: $t('31703955e64806b7') },
        { id: 3, title: $t('398c97e90c5e9171'), completed: false, priority: $t('5f2f4103151d6574') }
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
      const title = prompt($t('940cb93126476f7c'));
      if (title) {
        console.log($t('7a820f925d091b58'));
      }
    },
    editTask(index) {
      alert($t('177b0207795e502c'));
    },
    deleteTask(index) {
      if (confirm($t('ac34e5539feaf928'))) {
        this.tasks.splice(index, 1);
        console.log($t('f6d4e41366ff088b'));
      }
    },
    clearCompleted() {
      const msg = $t('9e5ee8744b43c096');
      if (confirm(msg)) {
        this.tasks = this.tasks.filter(t => !t.completed);
        console.log($t('ea78cce3b8b12895'));
      }
    }
  }
};
</script>
