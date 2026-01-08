<template>
  <div class="form-container">
    <h1>{{$t("be23983c8d3e66d6")}}</h1>
    
    <div class="form-group">
      <label>{{$t("60d0458ac6ebef0f")}}</label>
      <input type="text" v-bind:placeholder="$t('8093e3921d80b5da')" v-model="name">
    </div>
    
    <div class="form-group">
      <label>{{$t("3bc5e602b2d4c7ff")}}</label>
      <input type="email" v-bind:placeholder="$t('2ba4c815875437de')" v-model="email">
    </div>
    
    <div class="form-group">
      <label>{{$t("a8105204604a0b11")}}</label>
      <input type="password" v-bind:placeholder="$t('e39ffe99e93cb6cc')" v-model="password">
    </div>
    
    <div class="form-group">
      <label>{{$t("2432b57515b3627f")}}</label>
      <textarea :placeholder="textareaPlaceholder" v-model="notes"></textarea>
    </div>
    
    <div class="form-group">
      <select v-model="city">
        <option value="">{{$t("7e75a9ab5fa5bda8")}}</option>
        <option value="bj">{{$t("692e92669c0ca340")}}</option>
        <option value="sh">{{$t("e94e8bd35fc8144f")}}</option>
        <option value="gz">{{$t("7e040aa9cb2ec494")}}</option>
      </select>
    </div>
    
    <button @click="submit">{{$t("939d5345ad4345db")}}</button>
    <button @click="reset">{{$t("4b9c3271dc2f299d")}}</button>
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
      textareaPlaceholder: $t('245475e1fbcb099d')
    };
  },
  methods: {
    submit() {
      if (!this.name) {
        alert($t('8093e3921d80b5da'));
        return;
      }
      console.log($t('afeb8e0f887043d4'));
    },
    reset() {
      const msg = $t('7cea6cafa161daea');
      if (confirm(msg)) {
        console.log($t('a865cc9f3b64bc7a'));
      }
    }
  }
};
</script>
