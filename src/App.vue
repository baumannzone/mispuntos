<template lang="pug">
  #app
    transition(name='animt', mode='out-in')
      router-view

    //footer
      small: a(href="https://twitter.com/baumannzone") Jorge Baumann

</template>

<script>
  export default {
    name: 'app',
  };
</script>

<style lang="stylus">
  *
    font-family 'Avenir', Helvetica, Arial, sans-serif;

  #app
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
