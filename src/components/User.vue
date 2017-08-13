<template lang="pug">
  .user
    h1 {{ msg }}

</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      msg: 'User view',
    };
  },
};
</script>

<style lang="stylus" scoped>
</style>
