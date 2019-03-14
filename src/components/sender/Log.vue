<template>
  <div class="log" ref="log">
    <div v-for="l in logs" :key="l.id">
      <div class="log-item">
        <span>{{ l }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'log',
  props: ['logs'],
  watch: {
    logs: function() {
      this.updateLogPosition();
    }
  },
  methods: {
    updateLogPosition() {
      setTimeout(() => {
        this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
      }, 1);
    }
  }
}
</script>

<style scoped>
.log {
  background-color: #f4f4f4;
  border: 1px solid #aaa;
  color: #000;
  font-family: monospace;
  height: 300px;
  margin-top: 10px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 5px;
  width: 100%;
}

.log-item {
  border-bottom: 1px solid #ddd;
  line-height: 1.4em;
  margin: 0;
  padding: 0 0.5em;
  width: 100%;
}

.log-item span {
  padding-right: 0.5em;
  white-space: pre-wrap;
}
</style>


