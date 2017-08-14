<template lang="pug">
  #app
    router-link(to="/")
      img(src='./assets/logo.png' width="70")

    transition(name='animt', mode='out-in')
      router-view
</template>

<script>
  export default {
    name: 'app',
  };
</script>

<style lang="stylus">
  #app
    font-family 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing antialiased;
    -moz-osx-font-smoothing grayscale;
    text-align center;
    color #2c3e50;


  .animt-enter-active
    transition all .2s ease;

  .animt-leave-active
    transition all .2s ease;

  .animt-enter,
  .animt-leave-to
    transform translateY(20px)
    opacity 0

</style>
