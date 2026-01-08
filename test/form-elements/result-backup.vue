<template>
  <div class="form-container">
    <h1>{{$t("3")}}</h1>
    
    <div class="form-group">
      <label>{{$t("4")}}</label>
      <input type="text" v-bind:placeholder="$t('0')" v-model="name">
    </div>
    
    <div class="form-group">
      <label>{{$t("5")}}</label>
      <input type="email" v-bind:placeholder="$t('1')" v-model="email">
    </div>
    
    <div class="form-group">
      <label>{{$t("6")}}</label>
      <input type="password" v-bind:placeholder="$t('2')" v-model="password">
    </div>
    
    <div class="form-group">
      <label>{{$t("7")}}</label>
      <textarea :placeholder="textareaPlaceholder" v-model="notes"></textarea>
    </div>
    
    <div class="form-group">
      <select v-model="city">
        <option value="">{{$t("8")}}</option>
        <option value="bj">{{$t("9")}}</option>
        <option value="sh">{{$t("10")}}</option>
        <option value="gz">{{$t("11")}}</option>
      </select>
    </div>
    
    <button @click="submit">{{$t("12")}}</button>
    <button @click="reset">{{$t("13")}}</button>
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
      textareaPlaceholder: $t('14')
    };
  },
  methods: {
    submit() {
      if (!this.name) {
        alert($t('15'));
        return;
      }
      console.log($t('16'));
    },
    reset() {
      const msg = $t('17');
      if (confirm(msg)) {
        console.log($t('18'));
      }
    }
  }
};
</script>
