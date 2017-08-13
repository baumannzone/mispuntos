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
  export default {
    name: 'Home',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        tableData: [
          {
            date: '2016-05-03',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            date: '2016-05-02',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            date: '2016-05-04',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            date: '2016-05-01',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
          },
        ],
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
