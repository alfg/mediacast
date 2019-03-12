<template>
  <div class="sender container">
    <img class="logo" src="@/assets/clapper.png" />
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

      <div class="control-buttons">
        <button v-on:click="connect" class="button active" v-if="connected">Connected</button>
        <button v-on:click="connect" class="button-primary" v-else>Connect</button>
        <button v-on:click="loadMedia">Load Media</button>
        <button v-on:click="testMessage">Test Message</button>
        <label class="debug-toggle" for="checkbox">
          <input type="checkbox" id="checkbox" v-model="debugEnabled" @change="onDebugChange($event)">
          <span>Debug Panel</span>
        </label>
      </div>


      <div class="player-controls" v-if="connected">
          <button class="material-icons" v-on:click="pause" v-if="playing">pause_arrow</button>
          <button class="material-icons" v-on:click="play" v-else>play_arrow</button>
          <input class="seekBar" type="range" step="any" min="0" v-bind:max="duration" v-bind:value="currentTime" @change="onSeekChange">
          <button class="rewindButton material-icons">fast_rewind</button>
          <div class="currentTime">{{timeString}}</div>
          <button class="fastForwardButton material-icons">fast_forward</button>
          <button class="muteButton material-icons">volume_up</button>
          <input class="volumeBar" type="range" step="any" min="0" max="1" value="0" style="background: linear-gradient(to right, rgb(204, 204, 204) 67.2414%, rgb(0, 0, 0) 67.2414%, rgb(0, 0, 0) 100%);">
      </div>
    </div>
  </div>
</template>

<script>
import config from '../config';
import utils from '../lib/utils';
import '@/assets/normalize.css';
import '@/assets/skeleton.css';
import '@/assets/player-controls.css';

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
      connected: false,
      loaded: false,
      debugEnabled: true,
      playing: false,
      seeking: false,
      duration: 0,
      currentTime: 0,
    }
  },
  computed: {
    timeString: function() {
      return utils.buildTimeString(this.currentTime);
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
        this.mediaUrl = this.$route.query.url;
      }

      if (this.$route.query.licenseUrl) {
        this.licenseUrl = this.$route.query.licenseUrl;
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
      this.setPlayerEvents();
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
        // this.setPlayerEvents();
      }, (err) => {
        console.log('[mediacast] - Error:' + err);
      });
    },

    setPlayerEvents() {
      const player = new window.cast.framework.RemotePlayer();
      const playerController = new window.cast.framework.RemotePlayerController(player);

      playerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        this.onIsConnectedChanged,
      );

      playerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED,
        (event) => {
          console.log(event);
        }
      );

      playerController.addEventListener(
        cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
        this.onCurrentTimeChanged,
      );

      playerController.addEventListener(
        cast.framework.RemotePlayerEventType.DURATION_CHANGED,
        (event) => {
          console.log(event);
        }
      );

      playerController.addEventListener(
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
        this.onMediaInfoChanged,
      );

      playerController.addEventListener(
        cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
        this.onPlayerStateChanged,
      );

      // For debugging.
      // playerController.addEventListener(
      //   cast.framework.RemotePlayerEventType.ANY_CHANGE,
      //   (event) => {
      //     console.log(event);
      //   }
      // )
    },

    play() {
      console.log('[mediacast] - play');
      this.sendMessage("play");

      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const media = castSession.getMediaSession();

      if (!media) {
        this.loadMedia();
        return;
      }

      castSession.sendMessage('urn:x-cast:com.google.cast.media', {
        type: 'PLAY',
        requestId: 1,
        mediaSessionId: media.mediaSessionId,
      });
    },

    pause() {
      console.log('[mediacast] - pause');
      this.sendMessage("pause");

      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const media = castSession.getMediaSession();
      castSession.sendMessage('urn:x-cast:com.google.cast.media', {
        type: 'PAUSE',
        requestId: 1,
        mediaSessionId: media.mediaSessionId,
      });
    },

    seekTo(value) {
      console.log('[mediacast] - seekTo: ', value);
      this.sendMessage("seekTo to: " + value);

      this.seeking = true;

      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const media = castSession.getMediaSession();
      castSession.sendMessage('urn:x-cast:com.google.cast.media', {
        type: 'SEEK',
        requestId: 1,
        mediaSessionId: media.mediaSessionId,
        currentTime: value,
      });
      this.play();
    },

    setVolume(value) {
      console.log('[mediacast] - setVolume: ', value);
      this.sendMessage("setVolume to: " + value);

      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const media = castSession.getMediaSession();
      castSession.sendMessage('urn:x-cast:com.google.cast.media', {
        type: 'VOLUME',
        requestId: 1,
        mediaSessionId: media.mediaSessionId,
        volume: value,
      });
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

    onSeekChange(event) {
      console.log('[mediacast:onSeekChange] - ', event.target.value);
      this.seeking = true;
      if (event.target && event.target.value) {
        this.seekTo(event.target.value);
      }
    },

    onMediaInfoChanged(event) {
      console.log('[mediacast:onMediaInfoChanged] - ', event);
      this.duration = event.value && event.value.duration;
    },

    onCurrentTimeChanged(event) {
      console.log('[mediacast:onCurrentTimeChanged] - ', event);
      if (!this.seeking) {
        this.currentTime = event.value;
      }
    },

    onIsConnectedChanged(event) {
      console.log('[mediacast:onIsConnectedChanged] - ', event);
      this.connected = event.value;
    },

    onPlayerStateChanged(event) {
      console.log('[mediacast:onPlayerStateChanged] - ', event);
      this.playing = event.value === 'PLAYING' || event.value === 'BUFFERING';
      if (event.value === 'PLAYING') {
        this.seeking = false;
      }
    },
  }
}
</script>

<style scoped>
.logo {
  width: 48px;
}

.controls {
  text-align: left;
}

.controls button {
  margin: 0 2px;
}

.control-buttons {
  display: inline-block;
  margin-bottom: 10px;
}

.active {
  background-color: #005a00;
  border-color: #005a00;
  color: #FFF;
}

.debug-toggle {
  display: inline;
  margin: 0 10px;
}

.cast-button {
  float: left;
  width: 40px;
  height: 40px;
  opacity: 0.7;
  border: none;
  outline: none;
  margin-right: 5px;
}
</style>


