<template>
  <div class="receiver">
    <div class="stats">
      bitrate: {{ stats.bitrate }}
    </div>

    <div class="debug-log">
      <div v-for="m in debugLog"
        :key="m.id"
        >{{ m }}</div>
    </div>
    <cast-media-player></cast-media-player>
  </div>
</template>

<script>
const namespace = 'urn:x-cast:com.google.cast.mediacast';

export default {
  name: 'receiver',
  components: {},
  data() {
    return {
      drms: {},
      debugLog: [],
      stats: {
        bitrate: 0
      },
    }
  },
  mounted() {
      this.init();
  },
  methods: {
    init() {
      this.log('[mediacast:init] - Initializing.');
      const context = cast.framework.CastReceiverContext.getInstance();
      const player = context.getPlayerManager();

      // Set DRM contexts.
      this.setDrms();

      // Set player events and config.
      this.setPlayerEvents(player);

      // Listen for custom messages.
      context.addCustomMessageListener(namespace, this.onCustomMessage);

      this.log('[mediacast:init] - Application is ready, starting system.');
      context.start();
    },

    setPlayerEvents(player) {
      // Load event.
      player.setMessageInterceptor(cast.framework.messages.MessageType.LOAD,
      (loadRequestData) => {
        this.log('[mediacast:setPlayerEvents] - player.setMessageInterceptor:LOAD');
        this.log(JSON.stringify(loadRequestData.media));
        const url = loadRequestData.media.contentId;
        const licenseUrl = loadRequestData.media.customData.licenseUrl;
        const drm = loadRequestData.media.customData.drm;

        player.setMediaPlaybackInfoHandler((loadRequest, playbackConfig) => {
          playbackConfig.licenseUrl = licenseUrl;
          playbackConfig.protectionSystem =  this.drms[drm];
          this.log('[mediacast:playbackConfig - ' + JSON.stringify(playbackConfig));
          return playbackConfig;
        });
        return loadRequestData;
      });

      // player.addEventListener(cast.framework.events.EventType.ALL, (event) => {
      //   console.log(event);
      // });

      player.addEventListener(cast.framework.events.EventType.BITRATE_CHANGED, (event) => {
        this.log('[mediacast:events:BITRATE_CHANGED - ' + event.totalBitrate);
        this.stats.bitrate = event.totalBitrate;
      });
    },
    
    setDrms() {
      this.drms = {
        widevine: cast.framework.ContentProtection.WIDEVINE,
        playready: cast.framework.ContentProtection.PLAYREADY,
      }
    },

    // init() {
    //   this.log('[mediacast:init] - Initializing.');
    //   this.cast.receiver.logger.setLevelValue(this.cast.receiver.LoggerLevel.DEBUG);
    //   this.cast.player.api.setLoggerLevel(this.cast.player.api.LoggerLevel.DEBUG);

    //   this.castReceiverManager = this.cast.receiver.CastReceiverManager.getInstance();

    //   const mediaElement = this.$refs.video;
    //   this.mediaManager = new this.cast.receiver.MediaManager(mediaElement);
    //   this.mediaManager.onLoad = (event) => {
    //     const url = event.data.media.contentId;
    //     const licenseUrl = event.data.media.customData.licenseUrl;
    //     const drm = event.data.media.customData.drm;
    //     this.loadVideo(url, licenseUrl, drm);
    //   }

    //   // Create a CastMessageBus to handle messages for a custom namespace.
    //   this.messageBus = this.castReceiverManager.getCastMessageBus(namespace);
    //   this.messageBus.onMessage = this.messageBus_onMessage.bind(this);

      
    //   this.log('[mediacast:init] - Application is ready, starting system.');
    //   this.castReceiverManager.start({ statusText: "Application starting..."});
    // },

    // loadVideo(url, licenseUrl, drm) {
    //   this.log('[mediacast:loadVideo] - Loading video...');
    //   this.log('[mediacast:loadVideo:url] - ' + url);
    //   this.log('[mediacast:loadVideo:licenseUrl] - ' + licenseUrl);
    //   this.log('[mediacast:loadVideo:drm] - ' + drm);

    //   const mediaElement = this.$refs.video;
    //   const host = new this.cast.player.api.Host({
    //     'mediaElement': mediaElement,
    //     'url': url,
    //     'licenseUrl': licenseUrl,
    //     'protectionSystem': drms[drm],
    //   });

    //   host.onError = function(errorCode) {
    //     this.log('[mediacast:loadVideo] - Fatal Error - ' + errorCode);
    //     if (window.player) {
    //       window.player.unload();
    //       window.player = null;
    //     }
    //   };

    //   const player = new this.cast.player.api.Player(host);
    //   const ext = url.substring(url.lastIndexOf('.'), url.length);
    //   let protocol = null;

    //   if (ext.includes('.mpd')) {
    //     protocol = this.cast.player.api.CreateDashStreamingProtocol(host);
    //   } else if (ext.includes('.ism')) {
    //     protocol = this.cast.player.api.CreateSmoothStreamingProtocol(host);
    //   } else if (ext.includes('.m3u8')) {
    //     protocol = this.cast.player.api.CreateHlsStreamingProtocol(host);
    //   }

    //   // Load content at 0 time and play.
    //   player.load(protocol, 0);
    //   player.playWhenHaveEnoughData();

    //   // Bind events.
    //   const context = this.cast.framework.CastReceiverContext.getInstance();
    //   const playerManager = context.getPlayerManager();
    //   playerManager.addEventListener(
    //     this.cast.framework.events.EventType.PLAYER_LOAD_COMPLETE, () => {
    //       const audioTracksManager = playerManager.getAudioTracksManager();
    //       const tracks = audioTracksManager.getTracks();
    //       console.log(tracks);
    //     });
    // },

    onCustomMessage(event) {
      console.log('Message [' + event.senderId + ']: ' + JSON.stringify(event.data));
      this.log('[mediacast:onCustomMessage] - ' + event.data.message);

      // Inform all senders on the CastMessageBus of the incoming message event.
      // Sender message listener will be invoked.
      // this._messageBus.send(event.senderId, event.data);
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
    margin-bottom: 3px;
    text-align: left;
    width: 50%;
    z-index: 1;
}

.stats {
    position: absolute;
    top: 10px;
    left: 10px;
    text-align: left;
    width: 50%;
    height: 200px;
    z-index: 1;
}
</style>


