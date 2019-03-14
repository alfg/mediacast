<template>
  <div class="receiver-app">
    <Receiver />
  </div>
</template>

<script>
import Receiver from '@/components/receiver/Receiver.vue';

export default {
  name: 'receiver-app',
  components: {
    Receiver,
  },
}
</script>

<style>
body {
  overflow: hidden;
  background: black;
}

.receiver-app {
  background: black;
  color: white;
  height: 100%;
  text-align: center;
}

.receiver-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
}

.receiver-header {
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
}

.receiver-intro {
  font-size: large;
}
</style>
