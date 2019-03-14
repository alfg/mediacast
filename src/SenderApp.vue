<template>
  <div class="sender-app">
    <Sender />
  </div>
</template>

<script>
import Sender from '@/components/sender/Sender.vue';

export default {
  name: 'sender-app',
  components: {
    Sender,
  },
}
</script>

<style>
.sender-app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
