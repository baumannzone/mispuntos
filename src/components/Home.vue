<template lang="pug">
  .home
    router-link(to="/")
      img(src='../assets/logo.png' width="70")

    h1 {{ title }}
    el-table(:data='tableData', border, style='width: 100%', @cell-click="celda")
      el-table-column(label='Nombre', prop="name")
      el-table-column(label='Puntos')
        template(scope="scope")
          el-tooltip.item(effect="light" placement="right")
            div(slot="content")
              span
                span
                  i.fa.fa-thumbs-up.fa-lg.green-like.mr-5(aria-hidden='true')
                span {{ scope.row.likes }}
              span.ml-16
                span
                  i.fa.fa-thumbs-up.fa-lg.fa-rotate-180.red-dislike.mr-5(aria-hidden='true')
                span {{ scope.row.dislikes }}

            div(v-if="scope.row.likes > scope.row.dislikes")
              el-tag(type="success") {{ scope.row.likes - scope.row.dislikes }}
            div(v-if="scope.row.likes == scope.row.dislikes")
              el-tag(type="gray") 0
            div(v-if="scope.row.likes < scope.row.dislikes")
              el-tag(type="danger") {{ scope.row.likes - scope.row.dislikes }}

      el-table-column(label='Acciones')
        template(scope='scope')
          el-button(size='small', icon="arrow-up", @click='setLike(scope.$index, scope.row)')
          el-button(size='small', icon="arrow-down" type='danger', @click='setDislike(scope.$index, scope.row)')

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
        this.loading = false;
      } );
    },
    data() {
      return {
        title: 'Mi app de puntos',
        tableData: null,
      };
    },
    methods: {
      celda( row, column ) {
        if ( column.label === 'Nombre' ) {
          console.debug( row, column );
          this.$router.push( { name: 'User', params: { id: row.id } } );
        }
      },
      setLike( index, row ) {
        const likes = row.likes + 1;
        const event = { type: 'like', date: this.$moment().format( 'x' ) };
        db.ref( `users/${row.id}/likes` ).set( likes )
          .then( ( res ) => {
            console.debug( res );
            this.logEvent( row.id, event );
          } );
      },
      setDislike( index, row ) {
        const dislikes = row.dislikes + 1;
        const event = { type: 'dislike', date: this.$moment().format( 'x' ) };
        db.ref( `users/${row.id}/dislikes` ).set( dislikes )
          .then( ( res ) => {
            console.debug( res );
            this.logEvent( row.id, event );
          } );
      },
      logEvent( id, event ) {
        db.ref( `users/${id}` ).child( 'events' ).push( event )
          .then( ( ev ) => {
            console.debug( ev );
            this.$message( {
              message: 'Punto añadido.',
              type: 'success',
            } );
          } );
      },
    },
  };
</script>

<style lang="stylus">
  .mr-5
    margin-right 5px

  .ml-16
    margin-left 16px

  .green-like
    color #42b983

  .red-dislike
    color #FF4949

</style>
