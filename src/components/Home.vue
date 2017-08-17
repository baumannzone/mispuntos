<template lang="pug">
  .home
    header
      router-link(to="/")
        img(src='../assets/logo.png' width="44")
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

            div.no-select
              div(v-if="scope.row.totalPoints > 0")
                el-tag(type="success") {{ scope.row.totalPoints }}
              div(v-if="scope.row.totalPoints === 0")
                el-tag(type="gray") 0
              div(v-if="scope.row.totalPoints < 0")
                el-tag(type="danger") {{ scope.row.totalPoints }}

      el-table-column(label='Acciones' min-width="155")
        template(scope='scope')
          el-button(size='small', icon="arrow-up", @click='setLike(scope.$index, scope.row)')
          el-button(size='small', icon="arrow-down" type='danger', @click='setDislike(scope.$index, scope.row)')
          el-button(size='small', icon="star-off" type='info', @click='setChange(scope.$index, scope.row)')

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
        this.tableData.map( ( user ) => {
          console.debug( user );
          user.totalPoints = user.likes - user.dislikes - user.changes;
          return user;
        } );
        console.debug( this.tableData );
        this.loading = false;
      } );
    },
    data() {
      return {
        title: 'Mis puntos',
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
      setChange( index, row ) {
        // if `changes` not exists changes equal 1
        const changes = row.changes + 1 || 1;
        const event = { type: 'change', date: this.$moment().format( 'x' ) };
        db.ref( `users/${row.id}/changes` ).set( changes )
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
  header
    a
      display inline-block
    h1
      position: relative
      display inline-block
      top -12px
      margin-top 0
      margin-bottom 0
      margin-left 5px
      text-transform uppercase

  .mr-5
    margin-right 5px

  .ml-16
    margin-left 16px

  .green-like
    color #42b983

  .red-dislike
    color #FF4949

  .no-select
    -webkit-touch-callout none
    -webkit-user-select none
    -khtml-user-select none
    -moz-user-select none
    -ms-user-select none
    user-select none

</style>
