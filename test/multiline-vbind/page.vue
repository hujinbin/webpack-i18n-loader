<template>
  <j-tabs
    type="card"
    :options="[
      { label: '现金账户', name: '10' },
      { label: '返利账户', name: '20' },
      { label: '信用证账户', name: '30' },
      { label: '授信账户(中信保)', name: '40' }
    ]"
    v-model="tabs"></j-tabs>
</template>

<script>
export default {
  data() {
    return {
      tabs: '10'
    }
  }
}
</script>
