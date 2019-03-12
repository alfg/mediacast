<template>
  <div class="receiver">
    <div class="debug-panel" v-if="debugEnabled">
      <div class="debug-stats">
        bandwidth: {{ stats.bitrate }}
      </div>

      <div class="debug-log" ref="debugLog">
        <div v-for="m in debugLog"
          :key="m.id"
          >{{ m }}</div>
      </div>
    </div>

    <cast-media-player></cast-media-player>
  </div>
</template>

<script>
import config from '../config';

const { namespace } = config;

export default {
  name: 'receiver',
  components: {},
  data() {
    return {
      drms: {},
      debugEnabled: true,
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

      // TODO: Set debug level from sender.
      cast.framework.CastReceiverContext.getInstance().setLoggerLevel(cast.framework.LoggerLevel.DEBUG);

      // Set DRM contexts.
      this.setDrms();

      // Set player events and config.
      this.setPlayerEvents(player);

      // Set debug log.
      this.setDebugLog();

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
        const ext = url.substring(url.lastIndexOf('.'), url.length);

        loadRequestData.media.contentType = 'video/mp4';

        if (ext.includes('.mpd')) {
          loadRequestData.media.contentType = 'application/dash+xml';
        } else if (ext.includes('.ism')) {
          loadRequestData.media.contentType = 'application/vnd.ms-sstr+xml';
        } else if (ext.includes('.m3u8')) {
          loadRequestData.media.contentType = 'application/vnd.apple.mpegurl';
        }


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

      player.addEventListener(cast.framework.events.EventType.PLAYER_LOAD_COMPLETE, () => {
        this.log('[mediacast:events:PLAYER_LOAD_COMPLETE');

        console.log(player.getStats());
        console.log(player.getMediaInformation());
      });

      player.addEventListener(cast.framework.events.EventType.BITRATE_CHANGED, (event) => {
        this.log('[mediacast:events:BITRATE_CHANGED - ' + event.totalBitrate);
        this.stats.bitrate = event.totalBitrate;
        console.log(player.getStats());
      });
    },
    
    setDrms() {
      this.drms = {
        widevine: cast.framework.ContentProtection.WIDEVINE,
        playready: cast.framework.ContentProtection.PLAYREADY,
      }
    },

    setDebugLog() {
      // Keep debug log scrolled to the bottom;
      const w = this.$refs.debugLog;
      setInterval(() => {
        const scrolled = w.scrollHeight - w.clientHeight <= w.scrollTop + 1;
        if (!scrolled) {
          w.scrollTop = w.scrollHeight - w.clientHeight;
        }
      }, 1000);
    },

    onCustomMessage(event) {
      console.log('Message [' + event.senderId + ']: ' + JSON.stringify(event.data));
      this.log('[mediacast:onCustomMessage] - ' + JSON.stringify(event.data));

      // Check if action is received from sender.
      if (event.data.action) {
        switch (event.data.action) {
          case 'setDebugPanel':
            this.debugEnabled = event.data.message;
            break;
        
          default:
            break;
        }
      }

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

.debug-panel {
  height: 100%;
  width: 40%;
  padding-left: 10px;
  padding-top: 10px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.debug-stats {
    text-align: left;
    width: 100%;
    height: 20%;
}

.debug-log {
    overflow: auto;
    text-align: left;
    width: 100%;
    height: 75%;
}

</style>


