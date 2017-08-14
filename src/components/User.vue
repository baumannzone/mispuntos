<template lang="pug">
  .user
    h1 {{ msg }}

</template>

<script>
  import { db } from '../config/index';

  export default {
    name: 'User',
    mounted() {
      const usersRef = db.ref( 'users' );
      usersRef.on( 'value', ( snapshot ) => {
        // Add Id
        this.tableData = this.$_( snapshot.val() ) // wrap object so that you can chain lodash methods
          .mapValues( ( value, id ) => this.$_.merge( {}, value, { id } ) ) // attach id to object
          .values() // get the values of the result
          .value(); // unwrap array of objects
        console.debug( this.tableData );
      } );
    },
    data() {
      return {
        msg: 'User view',
      };
    },
  };
</script>

<style lang="stylus" scoped>
</style>
