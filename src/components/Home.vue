<template lang="pug">
  .home
    h1 {{ msg }}

    el-table(:data='tableData', border='', style='width: 100%', @cell-click="celda")
      el-table-column(label='Name', prop="name")
      el-table-column(label='Puntos')
        template(scope="scope")
          .tags
            el-tag.mr-5 {{ scope.row.likes }}
            el-tag(type="danger") {{ scope.row.dislikes }}
      el-table-column(label='Operations')
        template(scope='scope')
          el-button(size='small', icon="arrow-up", @click='handleEdit(scope.$index, scope.row)')
          el-button(size='small', icon="arrow-down" type='danger', @click='handleDelete(scope.$index, scope.row)')


</template>

<script>
  import { db } from '../config/index';

  export default {
    name: 'Home',
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
        msg: 'Welcome to Your Vue.js App',
        tableData: null,
      };
    },
    methods: {
      celda( row, column, cell, event ) {
        if ( column.label === 'Name' ) {
          console.debug( row, column, cell, event );
          this.$router.push( { name: 'User', params: { id: row.id } } );
        }
      },
    },
  };
</script>

<style lang="stylus" scoped>
  h1, h2
    font-weight normal

  .mr-5
    margin-right 5px

  a
    color #42b983

</style>
