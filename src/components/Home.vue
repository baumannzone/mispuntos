<template lang="pug">
  .home
    h1 Mi app de puntos
    el-table(:data='tableData', border, style='width: 100%', @cell-click="celda")
      el-table-column(label='Nombre', prop="name")
      el-table-column(label='Puntos')
        template(scope="scope")
          .tags
            el-tag.mr-5 {{ scope.row.likes }}
            el-tag(type="danger") {{ scope.row.dislikes }}
      el-table-column(label='Acciones')
        template(scope='scope')
          el-button(size='small', icon="arrow-up", @click='like(scope.$index, scope.row)')
          el-button(size='small', icon="arrow-down" type='danger', @click='dislike(scope.$index, scope.row)')

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
      like( index, row ) {
        console.debug( index, row );
        db.ref( `users/${row.id}/likes` ).set( row.likes + 1 )
          .then( ( res ) => {
            console.debug( res );
            this.$message( {
              message: 'Punto añadido.',
              type: 'success',
            } );
          } );
      },
      dislike( index, row ) {
        console.debug( index, row );
        db.ref( `users/${row.id}/dislikes` ).set( row.dislikes + 1 )
          .then( ( res ) => {
            console.debug( res );
            this.$message( {
              message: 'Punto añadido.',
              type: 'info',
            } );
          } );
      },
    },
  };
</script>

<style lang="stylus" scoped>
  .mr-5
    margin-right 5px

  a
    color #42b983

</style>
