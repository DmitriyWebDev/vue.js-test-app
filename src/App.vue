<template>
  <div id="app">
    <UsersSortedTable/>
  </div>
</template>

<script>
import UsersSortedTable from './components/UsersSortedTable/index';

export default {
  name: 'app',
  components: {
    UsersSortedTable,
  },
};
</script>

<style lang="scss">
  body {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
    box-sizing: border-box;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
