<template>
  <div class="container">
    <div class="language-switcher">
      <button @click="switchLanguage">
        {{ locale === 'zh' ? $t('cb727d3642f74429') : 'English' }}
      </button>
    </div>
    
    <h1>{{$t("eade91670ac55c4e")}}</h1>
    <p>{{$t("0a079e29e15808a7")}}</p>
    <button @click="count++">{{$t("f4d48d2271aa6eec")}}{{ count }}</button>
    <p>{{$t("ffabf09ac83ff970")}}{{ locale }}</p>
    
    <div class="demo-section">
      <h2>{{$t("d089eb8acc01948f")}}</h2>
      <ul>
        <li>{{$t("999303c13df0e0a6")}}</li>
        <li>{{$t("bd9cd087952d840d")}}</li>
        <li>{{$t("83c1c28dc7f8a890")}}</li>
      </ul>
    </div>
    
    <div class="form-section">
      <input v-bind:placeholder="$t('08b1fa1304152d12')" v-model="username">
      <input v-bind:placeholder="$t('528ce9e9a3fd8f2b')" v-model="logic">
      <button>{{$t("939d5345ad4345db")}}</button>
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
        { title: $t('058ebdf2884474eb'), content: $t('95bb9d2f09f4c440') },
        { title: $t('59a7027995a0737a'), content: $t('741f0127005b32c2') },
        { title: $t('7a2ad99433416ec0'), content: $t('67aa3ac6289adb31') }
      ]
    };
  },
  methods: {
    switchLanguage() {
      const status = $t('665c2431e85bc859');
      console.log($t('22fd957dc291ea96') + status);
      alert($t('630729e8d3f42802'));
    }
  },
};
</script>
