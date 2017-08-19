<template lang="pug">
  .home
    ul.nav-list
      li.img
        router-link(to="/")
          img(src='../assets/logo.png' width="24")
          span {{ title }}
      li.login(v-if="!isLogged", @click="loginVisible = !loginVisible")
        i.fa.fa-user-o.fa-lg(aria-hidden='true')
      li.login(v-if="isLogged", @click="signOut")
        i.fa.fa-sign-out.fa-lg(aria-hidden='true')

    template(v-if="loginVisible && !isLogged")
      .form-login(v-loading="loadingPage")
        el-form(:model="logindata", :rules="rules", ref="logindata", label-width="120px")
          el-form-item(label="Email" prop="email" required)
            el-input(type="email" autoComplete="on" v-model="logindata.email", size="small")
          el-form-item(label="Password" prop="pass" required)
            el-input(type="password" auto-complete="off" v-model="logindata.pass", size="small")
        span.dialog-footer(slot='footer')
          el-button(size="mini", @click='loginVisible = false') Cancelar
          el-button(size="mini", type='primary', @click="submitForm('logindata')") Entrar

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
              span.ml-16
                span
                  i.fa.fa-money.fa-lg.blue-change.mr-5(aria-hidden='true')
                span {{ scope.row.changes }}

            div.no-select
              div(v-if="scope.row.totalPoints > 0")
                el-tag(type="success") {{ scope.row.totalPoints }}
              div(v-if="scope.row.totalPoints === 0")
                el-tag(type="gray") 0
              div(v-if="scope.row.totalPoints < 0")
                el-tag(type="danger") {{ scope.row.totalPoints }}

      template(v-if="isLogged")
        el-table-column(label='Acciones' min-width="155")
          template(scope='scope')
            el-button(size='small', icon="arrow-up", @click='setLike(scope.$index, scope.row)')
            el-button(size='small', icon="arrow-down" type='danger', @click='setDislike(scope.$index, scope.row)')
            el-button(size='small', icon="star-off" type='info', @click='setChange(scope.$index, scope.row)')

</template>

<script>
  import { db, auth } from '../config/index';

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

      auth.onAuthStateChanged( ( user ) => {
        if ( user ) {
          this.isLogged = true;
          // User is signed in.
          console.debug( 'user' );
          console.debug( user );
        }
        else {
          // No user is signed in.
          console.debug( 'Not logged in' );
          this.isLogged = false;
        }
      } );
    },
    data() {
      return {
        title: 'Mis puntos',
        loadingPage: false,
        tableData: null,
        isLogged: false,
        loginVisible: false,
        logindata: {
          email: null,
          pass: null,
        },
        rules: {
          email: [
            { required: true, message: 'Introduce tu email', trigger: 'blur' },
            { type: 'email', message: 'Email inválido', trigger: 'blur,change' },
          ],
          pass: [
            { required: true, message: 'Introduce la contraseña', trigger: 'blur' },
          ],
        },
      };
    },
    methods: {
      showForm() {
        this.loginVisible = !this.loginVisible;
      },
      submitForm( formName ) {
        this.$refs[ formName ].validate( ( valid ) => {
          if ( valid ) {
            this.signIn();
            console.debug( 'submit!' );
            return true;
          }
          console.debug( 'error submit!!' );
          return false;
        } );
      },
      signIn() {
        this.loadingPage = true;
        const emailz = this.logindata.email;
        const pass = this.logindata.pass;
        auth.signInWithEmailAndPassword( emailz, pass )
          .then( ( result ) => {
            this.clearForm();
            this.loadingPage = false;
            this.loginVisible = false;
            const user = result.user;
            console.debug( user.uid );
          } )
          .catch( ( error ) => {
            this.loadingPage = false;
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
            console.debug( errorCode, errorMessage, email, credential );
            console.debug( 'error' );
            console.debug( error );
          } );
      },
      signOut() {
        this.loadingPage = false;
        auth.signOut().then(
          () => {
            // Sign-out successful.
            this.loginVisible = false;
          },
          ( error ) => {
            // An error happened.
          } );
      },
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
      clearForm() {
        this.logindata = {
          email: null,
          pass: null,
        };
      },
    },
  };
</script>

<style lang="stylus">

  ul.nav-list
    position relative
    display block
    overflow auto
    margin-bottom 0
    margin-top 0
    text-align left
    list-style none
    padding 5px
    background-color #00BCD4
    li
      float left
      &.img
        position: relative
        top: 2px
      & a
        text-decoration none
        color inherit
        & span
          position: relative
          text-transform uppercase
          top -7px
      &.login
        float right
        position relative
        top 4px
        padding-right 8px
        &:hover
          cursor pointer
          i
            color white
        i
          color #006064

  .form-login
    margin 10px
    .dialog-footer
      display block
      text-align right

  .mr-5
    margin-right 5px

  .ml-16
    margin-left 16px

  .green-like
    color #42b983

  .red-dislike
    color #FF4949

  .blue-change
    color #447890

  .no-select
    -webkit-touch-callout none
    -webkit-user-select none
    -khtml-user-select none
    -moz-user-select none
    -ms-user-select none
    user-select none

</style>
