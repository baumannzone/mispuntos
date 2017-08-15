<template lang="pug">
  .user
    h1 {{ msg }}

</template>

<script>
  import { db } from '../config/index';

  export default {
    name: 'User',
    mounted() {
      const userRef = db.ref( `users/${this.$route.params.id}` );
      userRef.on( 'value', ( snapshot ) => {
        // Add Id
        this.userData = snapshot.val();
        console.debug( this.userData );
      } );
    },
    data() {
      return {
        msg: 'User view',
        userData: null,
      };
    },
  };
</script>

<style lang="stylus" scoped>
</style>
