<template>
  <div class="sender container">
    <h1>Chromecast Sender</h1>

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
    <button v-on:click="playPause">Play/Pause</button>
    <button v-on:click="testMessage">Test Message</button>
     </div>
  </div>
</template>

<script>
import '@/assets/normalize.css';
import '@/assets/skeleton.css';

const namespace = 'urn:x-cast:com.google.cast.mediacast';
const applicationId = 'B24212A8';

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
    }
  },
  mounted() {
    this.init();
  },
  methods: {
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
      console.log('Initializing cast api', applicationId);
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

      console.log('trying to load media');
      castSession.loadMedia(request).then(() => {
        console.log('Load succeed');
      }, function(err) {
        console.log('Error:', err);
      });
    },
    playPause() {
      console.log('[mediacast] - playPause');
      const player = new window.cast.framework.RemotePlayer();
      const playerController = new window.cast.framework.RemotePlayerController(player);
      playerController.playOrPause();
    },
    testMessage() {
      console.log('sending test message');
      console.log(this.mediaUrl, this.licenseUrl, this.drm)
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      castSession.sendMessage(namespace, "Test Message");
    }
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


