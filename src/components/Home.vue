<template lang="pug">
  .home
    h1 {{ msg }}

    el-table(:data='tableData', border='', style='width: 100%')
      el-table-column(label='Date', width='180')
        template(scope='scope')
          el-icon(name='time')
          span(style='margin-left: 10px') {{ scope.row.date }}
      el-table-column(label='Name', width='180')
        template(scope='scope')
          el-popover(trigger='hover', placement='top')
            p Name: {{ scope.row.name }}
            p Addr: {{ scope.row.address }}
            .name-wrapper(slot='reference')
              el-tag {{ scope.row.name }}
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
        console.debug( 'VAL: ' );
        console.debug( snapshot.val() );
        this.tableData = snapshot.val();
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
