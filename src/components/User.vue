<template lang="pug">

  .user000(v-loading="false")
    .profile
      .img
        //img(src="userData.imgURL", v-if="userData.imgURL")
        //i.fa.fa-circle(v-else)

    input(type="file", @change="img($event.target.files)")
    pre File: {{ file }}
    el-button(@click="submitUpload") Subir


    //h1 {{ userData.name }}

    //el-row.row-bg(type='flex', justify='center')
      el-col(:span='8')
        .block.bg-purple
      el-col(:span='8')
        .block.bg-purple-light
      el-col(:span='8')
        .block.bg-purple

    p {{ userData }}

    //.history
      el-table

</template>

<script>
  import { db, storage } from '../config/index';

  export default {
    name: 'User',
    mounted() {
      const userRef = db.ref( `users/${this.$route.params.id}` );
      userRef.on( 'value', ( snapshot ) => {
        // Add Id
        this.userData = snapshot.val();
        this.loading = false;
        console.debug( this.userData );
      } );
    },
    data() {
      return {
        loading: true,
        userData: {
          name: null,
          likes: null,
          dislikes: null,
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
        storage.child( `images/users/${this.userData.name}` ).put( this.file )
          .then( ( snapshot ) => {
            console.debug( 'Uploaded a blob or file!' );
            console.debug( snapshot );
          } );
      },
    },
  };
</script>

<style lang="stylus" scoped>

  .user
    background: #1A2980; /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #26D0CE, #1A2980); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #26D0CE, #1A2980);

  .block
    height 50px

  .bg-purple {
    background: #d3dce6
  }

  .bg-purple-light {
    background: #e5e9f2
  }

  .file-select > .select-button {
    padding: 1rem;

    color: white;
    background-color: #2EA169;

    border-radius: .3rem;

    text-align: center;
    font-weight: bold;
  }

  /* Don't forget to hide the original file input! */
  .file-select > input[type="file"] {
    display: none;
  }

</style>
