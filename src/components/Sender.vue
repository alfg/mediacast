<template>
  <div class="sender container">
    <h1>Chromecast Sender</h1>

    <div class="controls">
    <label>Media URL</label>
    <input
      class="u-full-width"
      type="text"
      value="https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel-dash-widevine.ism/.mpd"
    />

    <label>License Server URL</label>
    <input
      class="u-full-width"
      type="text"
      value="https://widevine-proxy.appspot.com/proxy"
    />

    <label for="drm">DRM</label>
    <select class="u-full-width" id="drm">
      <option value="none">None</option>
      <option value="widevine">Widevine</option>
      <option value="playready">PlayReady</option>
    </select>

    <button v-on:click="connect">Connect</button>
    <button>Load Media</button>
    <button>Play/Pause</button>
    <button v-on:click="testMessage">Test Message</button>
     </div>
  </div>
</template>

<script>
import '@/assets/normalize.css';
import '@/assets/skeleton.css';

const namespace = 'urn:x-cast:com.google.cast.mediacast';
const applicationId = 'B24212A8';

      // _cast: window.cast,
      // _chrome: window.chrome,
      // _session: null,

const _cast = window.cast;

export default {
  name: 'sender',
  components: {
  },
  data() {
    return {
      mediaUrl: 'https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel-dash-widevine.ism/.mpd',
      licenseUrl: "https://widevine-proxy.appspot.com/proxy",
      drm: null,
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
    testMessage() {
      console.log('sending test message');
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


