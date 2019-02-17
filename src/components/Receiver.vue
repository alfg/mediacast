<template>
  <div class="debug-log">
    <h2>Debug Log</h2>
    <div v-for="m in debugLog"
      :key="m.id"
      >{{ m }}</div>
  </div>
</template>

<script>
const namespace = 'urn:x-cast:com.google.cast.mediacast';

export default {
  name: 'receiver',
  components: {
  },
  data() {
    return {
      cast: window.cast,
      player: window.player,
      castReceiverManager: null,
      messageBus: null,
      mediaManager: null,
      video: null,
      testing: null,

      debugLog: [],
    }
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 200);
  },
  methods: {
    init() {
      this.cast.receiver.logger.setLevelValue(this.cast.receiver.LoggerLevel.DEBUG);
      this.cast.player.api.setLoggerLevel(this.cast.player.api.LoggerLevel.DEBUG);

      this.castReceiverManager = this.cast.receiver.CastReceiverManager.getInstance();

      const mediaElement = this.video;
      this.mediaManager = new this.cast.receiver.MediaManager(mediaElement);
      this.mediaManager.onLoad = (event) => {
        console.log('media', event);

        const url = event.data.media.contentId;
        const licenseUrl = event.data.media.customData.licenseUrl;
        const drm = event.data.media.customData.drm;
        this.loadVideo(url, licenseUrl, drm);
      }

      // Create a CastMessageBus to handle messages for a custom namespace.
      this.messageBus = this.castReceiverManager.getCastMessageBus(namespace);
      this.messageBus.onMessage = this.messageBus_onMessage.bind(this);

      
      console.log('Application is ready, starting system');
      this.castReceiverManager.start({ statusText: "Application starting..."});
    },
    messageBus_onMessage(event) {
      console.log('Message [' + event.senderId + ']: ' + event.data);

      this.debugLog = this.debugLog.concat(event.data);

      // Inform all senders on the CastMessageBus of the incoming message event.
      // Sender message listener will be invoked.
      // self._messageBus.send(event.senderId, event.data);

      // console.log(this.state.debugLog);
    }
  }
}
</script>

<style scoped>
.video {
    width: 100%;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
}

.debug-log {
    position: absolute;
    top: 200px;
    left: 10px;
    text-align: left;
    width: 50%;
}
</style>


