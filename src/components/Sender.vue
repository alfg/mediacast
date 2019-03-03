<template>
  <div class="sender container">
    <h1>MediaCast - Sender</h1>

    <div class="controls">
      <label>Media URL</label>
      <input
        v-model="mediaUrl"
        class="u-full-width"
        type="text"
      />

      <label>License Server URL</label>
      <input
        v-model="licenseUrl"
        class="u-full-width"
        type="text"
      />

      <label for="drm">DRM</label>
      <select v-model="drm" class="u-full-width" id="drm">
        <option value="none">None</option>
        <option value="widevine">Widevine</option>
        <option value="playready">PlayReady</option>
      </select>

      <button v-on:click="connect" class="button-primary">Connect</button>
      <button v-on:click="loadMedia">Load Media</button>
      <button v-on:click="play">Play</button>
      <button v-on:click="pause">Pause</button>
      <button v-on:click="testMessage">Test Message</button>

      <label for="checkbox">
        <input type="checkbox" id="checkbox" v-model="debugEnabled" @change="onDebugChange($event)">
        <span>Debug Panel</span>
      </label>
    </div>
  </div>
</template>

<script>
import config from '../config';
import '@/assets/normalize.css';
import '@/assets/skeleton.css';

const { namespace, applicationId } = config;

export default {
  name: 'sender',
  components: {
  },
  data() {
    return {
      mediaUrl: 'https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel-dash-widevine.ism/.mpd',
      licenseUrl: "https://widevine-proxy.appspot.com/proxy",
      drm: "widevine",
      loaded: false,
      debugEnabled: true,
    }
  },
  mounted() {
    this.setQueryParams();
    this.init();
  },
  methods: {
    setQueryParams() {
      // Check if query params are set.
      if (this.$route.query.url) {
        this.mediaUrl = this.$route.query.url.toLowerCase();
      }

      if (this.$route.query.licenseUrl) {
        this.licenseUrl = this.$route.query.licenseUrl.toLowerCase();
      }

      if (this.$route.query.drm) {
        this.drm = this.$route.query.drm.toLowerCase();
      }
    },
    init() {
      window['__onGCastApiAvailable'] = (isAvailable) => {
          if (isAvailable) {
            setTimeout(() => {
              this.initializeCastApi();
            }, 50);
          }
      };
    },

    initializeCastApi() {
      console.log('[mediacast] - Initializing Cast API: ', applicationId);
      window.cast.framework.CastContext.getInstance().setOptions({
          receiverApplicationId: applicationId,
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
      });
    },

    connect() {
      if (cast) {
        cast.framework.CastContext.getInstance().requestSession();
      }
    },

    loadMedia() {
      const { mediaUrl, licenseUrl, drm } = this;

      const contentType = 'application/dash+xml';
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const mediaInfo = new window.chrome.cast.media.MediaInfo(mediaUrl, contentType);
      mediaInfo.customData = { licenseUrl, drm };
      const request = new window.chrome.cast.media.LoadRequest(mediaInfo);

      this.sendMessage('trying to load mediaUrl: ' + mediaUrl);
      castSession.loadMedia(request).then(() => {
        console.log('[mediacast] - Load succeeded');
      }, (err) => {
        console.log('[mediacast] - Error:' + err);
      });
    },

    play() {
      console.log('[mediacast] - play');
      this.sendMessage("play");

      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const media = castSession.getMediaSession();
      castSession.sendMessage('urn:x-cast:com.google.cast.media', {
        type: 'PLAY',
        requestId: 1,
        mediaSessionId: media.mediaSessionId
      })
    },

    pause() {
      console.log('[mediacast] - pause');
      this.sendMessage("pause");

      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const media = castSession.getMediaSession();
      castSession.sendMessage('urn:x-cast:com.google.cast.media', {
        type: 'PAUSE',
        requestId: 1,
        mediaSessionId: media.mediaSessionId
      })
    },

    testMessage() {
      console.log('[mediacast] - sending test message');
      this.sendMessage("Test");
    },

    sendMessage(message) {
      console.log('[mediacast:sendMessage] - ' + message);
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      castSession.sendMessage(namespace, { message: message });
    },

    onDebugChange(event) {
      console.log('[mediacast:setDebugPanel] - ' + this.debugEnabled);
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      castSession.sendMessage(namespace, { action: 'setDebugPanel', message: this.debugEnabled });
    },
  }
}
</script>

<style scoped>
.controls {
  text-align: left;
}

.controls button {
  margin: 0 2px;
}
</style>


