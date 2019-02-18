<template>
  <div class="receiver">
    <div class="debug-log">
      <div v-for="m in debugLog"
        :key="m.id"
        >{{ m }}</div>
    </div>

    <video id="video" ref="video" class="video" />
  </div>
</template>

<script>
const namespace = 'urn:x-cast:com.google.cast.mediacast';
const drms = {
  widevine: cast.player.api.ContentProtection.WIDEVINE,
  playready: cast.player.api.ContentProtection.PLAYREADY,
}

export default {
  name: 'receiver',
  components: {
  },
  data() {
    return {
      window: window,
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
      this.log('[mediacast:init] - Initializing.');
      this.cast.receiver.logger.setLevelValue(this.cast.receiver.LoggerLevel.DEBUG);
      this.cast.player.api.setLoggerLevel(this.cast.player.api.LoggerLevel.DEBUG);

      this.castReceiverManager = this.cast.receiver.CastReceiverManager.getInstance();

      const mediaElement = this.$refs.video;
      this.mediaManager = new this.cast.receiver.MediaManager(mediaElement);
      this.mediaManager.onLoad = (event) => {
        const url = event.data.media.contentId;
        const licenseUrl = event.data.media.customData.licenseUrl;
        const drm = event.data.media.customData.drm;
        this.loadVideo(url, licenseUrl, drm);
      }

      // Create a CastMessageBus to handle messages for a custom namespace.
      this.messageBus = this.castReceiverManager.getCastMessageBus(namespace);
      this.messageBus.onMessage = this.messageBus_onMessage.bind(this);

      
      this.log('[mediacast:init] - Application is ready, starting system.');
      this.castReceiverManager.start({ statusText: "Application starting..."});
    },

    loadVideo(url, licenseUrl, drm) {
      this.log('[mediacast:loadVideo:url] - ' + url);
      this.log('[mediacast:loadVideo:licenseUrl] - ' + licenseUrl);
      this.log('[mediacast:loadVideo:drm] - ' + drm);

      const mediaElement = this.$refs.video;
      const host = new this.cast.player.api.Host({
        'mediaElement': mediaElement,
        'url': url,
        'licenseUrl': licenseUrl,
        'protectionSystem': drms[drm],
      });

      host.onError = function(errorCode) {
        this.log('[mediacast:loadVideo] - Fatal Error - ' + errorCode);
        if (window.player) {
          window.player.unload();
          window.player = null;
        }
      };

      const player = new this.cast.player.api.Player(host);
      const ext = url.substring(url.lastIndexOf('.'), url.length);
      let protocol = null;

      if (ext.includes('.mpd')) {
        protocol = this.cast.player.api.CreateDashStreamingProtocol(host);
      } else if (ext.includes('.ism')) {
        protocol = this.cast.player.api.CreateSmoothStreamingProtocol(host);
      } else if (ext.includes('.m3u8')) {
        protocol = this.cast.player.api.CreateHlsStreamingProtocol(host);
      }

      // Load content at 0 time and play.
      player.load(protocol, 0);
      player.playWhenHaveEnoughData();
    },

    messageBus_onMessage(event) {
      console.log('Message [' + event.senderId + ']: ' + event.data);
      this.log(event.data);

      // Inform all senders on the CastMessageBus of the incoming message event.
      // Sender message listener will be invoked.
      // self._messageBus.send(event.senderId, event.data);

      // console.log(this.state.debugLog);
    },

    log(message) {
      console.log(message);
      this.debugLog = this.debugLog.concat(message);
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
    z-index: 0;
}

.debug-log {
    position: absolute;
    top: 200px;
    left: 10px;
    text-align: left;
    width: 50%;
    z-index: 1;
}
</style>


