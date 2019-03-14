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
        <button v-on:click="connect" class="button-primary" :disabled="!isChrome()" v-else>Connect</button>
        <span v-if="!isChrome()">Google Chrome required!</span>
        <button v-on:click="loadMedia" v-if="connected">Load Media</button>
        <button v-on:click="stop" v-if="connected">Stop</button>
        <button v-on:click="testMessage" v-if="connected">Test Message</button>
        <label class="debug-toggle" for="checkbox" v-if="connected">
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
        <button class="muteButton material-icons" v-on:click="setMute" v-if="muted">volume_mute</button>
        <button class="muteButton material-icons" v-on:click="setMute" v-else>volume_up</button>
        <input
          class="volumeBar"
          type="range"
          step="any"
          min="0"
          max="1"
          v-bind:value="volume"
          v-bind:style="{ background: 'linear-gradient(to right, rgb(204, 204, 204) ' + volume * 100 + '%, rgb(0, 0, 0) ' + volume * 100 + '%, rgb(0, 0, 0) 100%)' }"
          @change="onVolumeChange"
        />
      </div>

      <div class="log" ref="log">
        <div v-for="l in debugLog" :key="l.id">
          <div class="log-item">
            <span>{{ l }}</span>
          </div>
        </div>
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

const { namespace, applicationId, defaultUrl, defaultLicenseUrl, defaultDrm } = config;

export default {
  name: 'sender',
  components: {
  },
  data() {
    return {
      mediaUrl: defaultUrl,
      licenseUrl: defaultLicenseUrl,
      drm: defaultDrm,
      connected: false,
      loaded: false,
      debugEnabled: true,
      playing: false,
      seeking: false,
      duration: 0,
      currentTime: 0,
      volume: 0.70,
      savedVolume: 0.70,
      muted: false,
      debugLog: [],
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
      this.log('[mediacast] - Initializing Cast API: ', applicationId);
      window.cast.framework.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
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
        this.log('[mediacast] - Load succeeded');
        // this.setPlayerEvents();
      }, (err) => {
        this.log('[mediacast] - Error:' + err);
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
          this.log('[mediacast:onIsMediaLoadedChanged] - ', JSON.stringify(event));
        }
      );

      playerController.addEventListener(
        cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
        this.onCurrentTimeChanged,
      );

      playerController.addEventListener(
        cast.framework.RemotePlayerEventType.DURATION_CHANGED,
        (event) => {
          this.log('[mediacast:onDurationChanged] - ', JSON.stringify(event));
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
      //     this.log(event);
      //   }
      // )
    },

    play() {
      this.log('[mediacast:play]');
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
      this.log('[mediacast:pause]');
      this.sendMessage("pause");

      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const media = castSession.getMediaSession();
      castSession.sendMessage('urn:x-cast:com.google.cast.media', {
        type: 'PAUSE',
        requestId: 1,
        mediaSessionId: media.mediaSessionId,
      });
    },

    stop() {
      this.log('[mediacast:stop]');
      this.sendMessage("stop");

      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      const media = castSession.getMediaSession();
      castSession.sendMessage('urn:x-cast:com.google.cast.media', {
        type: 'STOP',
        requestId: 1,
        mediaSessionId: media.mediaSessionId,
      });
    },

    seekTo(value) {
      this.log('[mediacast:seekTo] - ', value);
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
      this.log('[mediacast:setVolume] - ', value);
      this.sendMessage("setVolume to: " + value);
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      castSession.setVolume(parseFloat(value));
      this.volume = value;

      if (this.volume > 0) {
        this.muted = false;
      }
    },

    setMute() {
      this.log('[mediacast:setMute] - ', !this.muted);
      this.sendMessage("setMute to: " + !this.muted);
      this.muted = !this.muted;
      if (this.muted) {
        this.savedVolume = this.volume;
        this.volume = 0;
      } else {
        this.volume = this.savedVolume;
      }
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      castSession.setMute(this.muted);
    },

    testMessage() {
      this.sendMessage("Test");
    },

    sendMessage(message) {
      this.log('[mediacast:sendMessage] - ', message);
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      castSession.sendMessage(namespace, { message: message });
    },

    onDebugChange() {
      this.log('[mediacast:setDebugPanel] - ', this.debugEnabled);
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      castSession.sendMessage(namespace, { action: 'setDebugPanel', message: this.debugEnabled });
    },

    onSeekChange(event) {
      this.log('[mediacast:onSeekChange] - ', event.target.value);
      this.seeking = true;
      if (event.target && event.target.value) {
        this.seekTo(event.target.value);
      }
    },

    onVolumeChange(event) {
      this.log('[mediacast:onVolumeChange] - ', event.target.value);
      this.volume = event.target.value;
      if (event.target && event.target.value) {
        this.setVolume(event.target.value);
      }
    },

    onMediaInfoChanged(event) {
      this.log('[mediacast:onMediaInfoChanged] - ', JSON.stringify(event));
      this.duration = event.value && event.value.duration;
    },

    onCurrentTimeChanged(event) {
      this.log('[mediacast:onCurrentTimeChanged] - ', JSON.stringify(event));
      if (!this.seeking) {
        this.currentTime = event.value;
      }
    },

    onIsConnectedChanged(event) {
      this.log('[mediacast:onIsConnectedChanged] - ', JSON.stringify(event));
      this.connected = event.value;
    },

    onPlayerStateChanged(event) {
      this.log('[mediacast:onPlayerStateChanged] - ', JSON.stringify(event));
      this.playing = event.value === 'PLAYING' || event.value === 'BUFFERING';
      if (event.value === 'PLAYING') {
        this.seeking = false;
      }
    },

    isChrome() {
      console.log('isChrome');
      return /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor);
    },

    log(...message) {
      console.log(message.join(' '));
      this.debugLog = this.debugLog.concat(message.join(' '));
      setTimeout(() => {
        this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
      }, 1);
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

.control-buttons span {
  margin-left: 10px;
}

.active {
  background-color: #005a00;
  border-color: #005a00;
  color: #FFF;
}

button:disabled,
button[disabled] {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
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

.log {
  background-color: #f4f4f4;
  border: 1px solid #aaa;
  color: #000;
  font-family: monospace;
  height: 300px;
  margin-top: 10px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 5px;
  width: 100%;
}

.log-item {
  border-bottom: 1px solid #ddd;
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


