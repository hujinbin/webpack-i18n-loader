<template>
  <div class="form-container">
    <h1>{{$t("8d3e66d61de7c4f4")}}</h1>
    
    <div class="form-group">
      <label>{{$t("c6ebef0fff1331af")}}</label>
      <input type="text" v-bind:placeholder="$t('1d80b5da7947f658')" v-model="name">
    </div>
    
    <div class="form-group">
      <label>{{$t("b2d4c7fffe79258e")}}</label>
      <input type="email" v-bind:placeholder="$t('875437de0ead4423')" v-model="email">
    </div>
    
    <div class="form-group">
      <label>{{$t("604a0b11e916f387")}}</label>
      <input type="password" v-bind:placeholder="$t('e93cb6cc8d5978ed')" v-model="password">
    </div>
    
    <div class="form-group">
      <label>{{$t("15b3627faddccb1d")}}</label>
      <textarea :placeholder="textareaPlaceholder" v-model="notes"></textarea>
    </div>
    
    <div class="form-group">
      <select v-model="city">
        <option value="">{{$t("5fa5bda88cfc8757")}}</option>
        <option value="bj">{{$t("9c0ca340eff4fdce")}}</option>
        <option value="sh">{{$t("5fc8144f38fd1ebc")}}</option>
        <option value="gz">{{$t("cb2ec494b0a4d52c")}}</option>
      </select>
    </div>
    
    <button @click="submit">{{$t("ad4345dbaabe1479")}}</button>
    <button @click="reset">{{$t("dc2f299dc3aeffb3")}}</button>
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
      textareaPlaceholder: $t('fbcb099dac261234')
    };
  },
  methods: {
    submit() {
      if (!this.name) {
        alert($t('1d80b5da7947f658'));
        return;
      }
      console.log($t('887043d444e4f89a'));
    },
    reset() {
      const msg = $t('a161daeafdf3a524');
      if (confirm(msg)) {
        console.log($t('3b64bc7affa6dcff'));
      }
    }
  }
};
</script>
