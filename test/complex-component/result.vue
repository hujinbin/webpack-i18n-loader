<template>
  <div class="container">
    <div class="language-switcher">
      <button @click="switchLanguage">
        {{ locale === 'zh' ? $t('42f744290e2c959c') : 'English' }}
      </button>
    </div>
    
    <h1>{{$t("0ac55c4e377a814e")}}</h1>
    <p>{{$t("e15808a7297fec17")}}</p>
    <button @click="count++">{{$t("71aa6eecfd2bae8e")}}{{ count }}</button>
    <p>{{$t("c83ff9703f86c8c9")}}{{ locale }}</p>
    
    <div class="demo-section">
      <h2>{{$t("cc01948f370023ac")}}</h2>
      <ul>
        <li>{{$t("3df0e0a6c9174f7f")}}</li>
        <li>{{$t("952d840d2fa37ba9")}}</li>
        <li>{{$t("c7f8a890a19e3d32")}}</li>
      </ul>
    </div>
    
    <div class="form-section">
      <input v-bind:placeholder="$t('04152d1213c1a758')" v-model="username">
      <input v-bind:placeholder="$t('a3fd8f2b9947790c')" v-model="logic">
      <button>{{$t("ad4345dbaabe1479")}}</button>
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
        { title: $t('884474ebff2977ba'), content: $t('09f4c4403d15927e') },
        { title: $t('95a0737a3c867d5f'), content: $t('005b32c28148ce76') },
        { title: $t('33416ec063da356d'), content: $t('289adb31e8c0fccb') }
      ]
    };
  },
  methods: {
    switchLanguage() {
      const status = $t('e85bc859af4837ac');
      console.log($t('c291ea965d780814') + status);
      alert($t('d3f428020d616426'));
    }
  },
};
</script>
