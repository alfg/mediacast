<template>
  <div class="debug-panel" v-bind:class="{ active: debugEnabled }">
    <div class="debug-stats">
      <span>bandwidth: {{ stats.bitrate }}</span>
      <span>state: {{ stats.state }}</span>
      <span>current time: {{ stats.currentMediaTime }}</span>
    </div>

    <div class="log" ref="log">
      <div v-for="l in logs" :key="l.id">
        <div class="log-item">
          <span>{{ l }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'log',
  props: ['logs', 'stats', 'debugEnabled'],
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
.debug-panel {
  display: none;
  height: 100%;
  width: 50%;
  font-family: monospace;
  padding-left: 10px;
  padding-top: 10px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.debug-panel.active {
  display: block;
}

.debug-stats {
    text-align: left;
    width: 100%;
    height: 20%;
}

.debug-stats span {
  display: block;
}

.log {
  overflow: auto;
  text-align: left;
  width: 100%;
  height: 75%;
  word-wrap: break-word;
}

.log-item {
  border-bottom: 1px solid #fff3;
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


