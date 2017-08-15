<template lang="pug">
  .user000(v-loading="false")
    .profile
      .img
        img(src="userData.imgURL" v-if="userData.imgURL")
        i.fa.fa-circle(v-else)
        el-upload.upload-demo(action='#', :auto-upload="false",
          :on-preview='handlePreview',
          :on-remove='handleRemove',
          list-type="picture",
          :file-list='fileList')
          el-button(size='small', type='primary') Click to upload
          .el-upload__tip(slot='tip') jpg/png files with a size less than 500kb


    h1 {{ userData.name }}

    el-row.row-bg(type='flex', justify='center')
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
  import { db } from '../config/index';

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
        fileList: [],
        loading: true,
        userData: {
          name: null,
          likes: null,
          dislikes: null,
        },
      };
    },
    methods: {
      handleRemove( file, fileList ) {
        console.debug( file, fileList );
      },
      handlePreview( file ) {
        console.debug( file );
      },
    },
  };
</script>

<style lang="stylus" scoped>

  .user
    background: #1A2980; /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #26D0CE, #1A2980); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #26D0CE, #1A2980);

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .block
    height 50px

  .bg-purple {
    background: #d3dce6
  }

  .bg-purple-light {
    background: #e5e9f2
  }
</style>
