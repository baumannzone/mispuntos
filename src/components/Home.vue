<template lang="pug">
  .home
    h1 {{ msg }}

</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
};
</script>

<style lang="stylus" scoped>
h1, h2
  font-weight normal

a
  color #42b983

</style>
