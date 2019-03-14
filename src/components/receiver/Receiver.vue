<template>
  <div class="receiver">
    <div class="debug-panel" v-bind:class="{ active: debugEnabled }">
      <div class="debug-stats">
        <span>bandwidth: {{ stats.bitrate }}</span>
        <span>state: {{ stats.state }}</span>
        <span>current time: {{ stats.currentMediaTime }}</span>
      </div>

      <div class="debug-log" ref="log">
        <div v-for="m in debugLog"
          :key="m.id"
          >{{ m }}</div>
      </div>
    </div>

    <cast-media-player></cast-media-player>
  </div>
</template>

<script>
import config from '@/config';

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
        bitrate: 0,
        state: 'INIT',
        currentMediaTime: 0,
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

      player.addEventListener(cast.framework.events.EventType.PLAYING, (event) => {
        this.log('[mediacast:events:PLAYING - ', JSON.stringify(event));
      });

      player.addEventListener(cast.framework.events.EventType.PAUSE, (event) => {
        this.log('[mediacast:events:PAUSE - ', JSON.stringify(event));
      });

      player.addEventListener(cast.framework.events.EventType.SEEKING, (event) => {
        this.log('[mediacast:events:SEEKING - ', JSON.stringify(event));
      });

      player.addEventListener(cast.framework.events.EventType.BUFFERING, (event) => {
        this.log('[mediacast:events:BUFFERING - ', JSON.stringify(event));
      });

      player.addEventListener(cast.framework.events.EventType.TIME_UPDATE, (event) => {
        // this.log('[mediacast:events:TIME_UPDATE - ', JSON.stringify(event));
        this.stats.currentMediaTime = event.currentMediaTime;
      });

      player.addEventListener(cast.framework.events.EventType.MEDIA_STATUS, (event) => {
        this.log('[mediacast:events:MEDIA_STATUS - ', JSON.stringify(event));
        this.stats.state = event.mediaStatus.playerState;
      });

      // For debugging.
      // player.addEventListener(cast.framework.events.EventType.ALL, (event) => {
      //   console.log(event);
      // });

    },
    
    setDrms() {
      this.drms = {
        widevine: cast.framework.ContentProtection.WIDEVINE,
        playready: cast.framework.ContentProtection.PLAYREADY,
      }
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

    log(...message) {
      console.log(message.join(' '));
      this.debugLog = this.debugLog.concat(message.join(' '));
      setTimeout(() => {
        this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
      }, 1);
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
  display: none;
  height: 100%;
  width: 50%;
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

.debug-log {
    overflow: auto;
    text-align: left;
    width: 100%;
    height: 75%;
    word-wrap: break-word;
}

</style>


