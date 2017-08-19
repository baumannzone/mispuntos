<template lang="pug">

  .user(v-loading="false")
    .profile
      span.float-button
        el-button(type="text")
          router-link(to="/")
            i.fa.fa-chevron-left.fa-2x(aria-hidden='true')
      .img
        img(:src="userData.imgURL", v-if="userData.imgURL")
        img(src="../assets/default-user.png", v-else)

      h1 {{ userData.name }}
      span.total(v-if="userData.likes") {{ userData.likes - userData.dislikes - userData.changes }}

      el-row.row-bg(type='flex', justify='center')
        el-col
          .block
            span {{ userData.likes }}
              i.fa.fa-thumbs-up.fa-lg.icon-thumb(aria-hidden='true')
        el-col
          .block
            span {{ userData.changes }}
              i.fa.fa-money.fa-lg.icon-thumb(aria-hidden='true')
        el-col
          .block
            span {{ userData.dislikes }}
              i.fa.fa-thumbs-up.fa-lg.fa-rotate-180.icon-thumb(aria-hidden='true')

    .history
      el-table(:data='userData.events', stripe, style='width: 100%')
        el-table-column(label='Fecha', prop="dateConvert")
        el-table-column(label='Tipo')
          template(scope="scope")
            i.fa.fa-thumbs-up.green-like(aria-hidden='true', v-if="scope.row.type === 'like' ")
            i.fa.fa-thumbs-up.fa-rotate-180.red-dislike(aria-hidden='true', v-if="scope.row.type === 'dislike' ")
            i.fa.fa-money.fa-lg.blue-change(aria-hidden='true', v-if="scope.row.type === 'change' ")

    .file-select
      input(type="file", @change="img($event.target.files)")
      el-button(@click="submitUpload") Subir

</template>

<script>
  import { db, storage } from '../config/index';

  export default {
    name: 'User',
    created() {
      const userRef = db.ref( `users/${this.$route.params.id}` );
      userRef.on( 'value', ( snapshot ) => {
        this.userData = snapshot.val();
        this.userData.id = this.$route.params.id;
        if ( this.userData.events ) {
          const events = this.userData.events;
          // Obj to arr
          this.userData.events = Object.keys( events ).map( key => events[ key ] );
          // Format events date
          this.userData.events = this.userData.events
            .map( ( item ) => {
              item.dateConvert = this.$moment( item.date, 'x' ).format( 'DD/MM/YYYY HH:mm' );
              return item;
            } )
            .reverse();
        }
      } );
    },
    data() {
      return {
        loadingImage: false,
        userData: {
          name: null,
          likes: null,
          dislikes: null,
          events: null,
        },
        file: null,
      };
    },
    methods: {
      img( files ) {
        console.debug( files[ 0 ] );
        this.file = files[ 0 ];
      },
      submitUpload() {
        const extension = this.file.name.split( '.' ).pop();
        storage.child( `images/users/${this.userData.id}/${this.userData.name}.${extension}` ).put( this.file )
          .then( ( snapshot ) => {
            this.file = null;
            const imgURL = snapshot.downloadURL;
            console.debug( imgURL );
            this.userData.imgURL = imgURL;
            db.ref( `users/${this.userData.id}` ).update( { imgURL } )
              .then( ( res ) => {
                console.debug( res );
              } );
          } );
      },
    },
  };
</script>

<style lang="stylus" scoped>
  $color1 = #26D0CE;
  $color2 = #1f75a4;
  $color3 = #447890


  .profile
    background: $color2; /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, $color1, $color2);
    background: linear-gradient(to bottom, $color1, $color2);

  span.float-button
    float left
    position absolute
    left 20px
    top 10px
    i
      color white

  .img
    padding-top 20px
    img
      border-radius 50%
      border 4px solid #4c96cc
      width 150px
      height 150px

  h1
    margin-top 5px
    margin-bottom 5px

  .block
    height 50px
    line-height 50px
    background-color rgba(255, 255, 255, .4)

  span.total
    font-weight bolder
    font-size: 2rem
    color: white;
    text-shadow: 0 0 19px #ffffff;

  .icon-thumb
    position: relative
    top -3px
    margin-left 5px
    font-size 0.8rem
    color $color3

  .green-like
    color #42b983

  .red-dislike
    color #FF4949

  .blue-change
    color $color3

</style>
