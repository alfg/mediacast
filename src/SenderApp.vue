<template>
  <div class="sender-app">
    <Header />
    <Controls />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/sender/Header.vue';
import Controls from '@/components/sender/Controls.vue';
import Footer from '@/components/sender/Footer.vue';

export default {
  name: 'sender-app',
  components: {
    Header,
    Controls,
    Footer,
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
