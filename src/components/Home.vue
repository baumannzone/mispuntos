<template lang="pug">
  .home
    h1 {{ msg }}

    el-table(:data='tableData', border='', style='width: 100%')
      el-table-column(label='Name', prop="name")
      el-table-column(label='Puntos')
        template(scope="scope")
          .tags
            el-tag {{ scope.row.likes }}
            el-tag(type="danger") {{ scope.row.dislikes }}
      el-table-column(label='Operations')
        template(scope='scope')
          el-button(size='small', @click='handleEdit(scope.$index, scope.row)') Edit
          el-button(size='small', type='danger', @click='handleDelete(scope.$index, scope.row)') Delete


</template>

<script>
  import { db } from '../config/index';

  export default {
    name: 'Home',
    mounted() {
      const usersRef = db.ref( 'users' );
      console.debug( usersRef );
      usersRef.on( 'value', ( snapshot ) => {
        console.debug( snapshot.val() );
        // Add Id
        this.tableData = this.$_( snapshot.val() ) // wrap object so that you can chain lodash methods
          .mapValues( ( value, id ) => this.$_.merge( {}, value, { id } ) ) // attach id to object
          .values() // get the values of the result
          .value(); // unwrap array of objects
      } );
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        tableData: null,
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
