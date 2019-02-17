<template>
  <div class="home">
    <Sender />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Sender from '@/components/Sender.vue'

export default {
  name: 'home',
  components: {
    // HelloWorld,
    Sender
  }
}
</script>

<style>
</style>