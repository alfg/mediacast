import React, { Component } from 'react';
import './Receiver.css';


class Receiver extends Component {
  constructor(props) {
      super(props);
      this.state = {
        debugLog: [],
      };

      this.window = window;

      this.namespace = 'urn:x-cast:com.google.cast.mediacast';
      this._cast = window.cast;
      this._player = window.player;
      this._castReceiverManager = null;
      this._messageBus = null;
      this._mediaManager = null;
      this.video = null;

      this.drms = {
        widevine: this._cast.player.api.ContentProtection.WIDEVINE,
        playready: this._cast.player.api.ContentProtection.PLAYREADY,
      }
  }

  componentDidMount() {
    this._cast.receiver.logger.setLevelValue(this._cast.receiver.LoggerLevel.DEBUG);
    this._cast.player.api.setLoggerLevel(this._cast.player.api.LoggerLevel.DEBUG);

    this._castReceiverManager = this._cast.receiver.CastReceiverManager.getInstance();

    const mediaElement = this.video;
    this._mediaManager = new this._cast.receiver.MediaManager(mediaElement);
    this._mediaManager.onLoad = (event) => {
      console.log('media', event);

      const url = event.data.media.contentId;
      const licenseUrl = event.data.media.customData.licenseUrl;
      const drm = event.data.media.customData.drm;
      this.loadVideo(url, licenseUrl, drm);
    }

    // Create a CastMessageBus to handle messages for a custom namespace.
    this._messageBus = this._castReceiverManager.getCastMessageBus(this.namespace);
    this._messageBus.onMessage = this.messageBus_onMessage.bind(this);

    
    console.log('Application is ready, starting system');
    this._castReceiverManager.start({ statusText: "Application starting..."});
  }

  loadVideo(url, licenseUrl, drm) {
    console.log(this._cast.player.api.ContentProtection);
    const mediaElement = this.video;
    const host = new this._cast.player.api.Host({
      'mediaElement': mediaElement,
      'url': url,
      'licenseUrl': licenseUrl,
      'protectionSystem': this.drms[drm],
    });

    host.onError = function(errorCode) {
      console.log("Fatal Error - " + errorCode);
      if (window.player) {
        window.player.unload();
        window.player = null;
      }
    };

    this._player = new this._cast.player.api.Player(host);


    const ext = url.substring(url.lastIndexOf('.'), url.length);
    let protocol = null;

    if (ext.includes('.mpd')) {
      protocol = this._cast.player.api.CreateDashStreamingProtocol(host);
    } else if (ext.includes('.ism')) {
      protocol = this._cast.player.api.CreateSmoothStreamingProtocol(host);
    } else if (ext.includes('.m3u8')) {
      protocol = this._cast.player.api.CreateHlsStreamingProtocol(host);
    }

    // Load content at 0 time and play.
    this._player.load(protocol, 0);
    this._player.playWhenHaveEnoughData();
  }

   messageBus_onMessage = (event) => {
    console.log('Message [' + event.senderId + ']: ' + event.data);

    this.setState({ debugLog: this.state.debugLog.concat(event.data) });

    // Inform all senders on the CastMessageBus of the incoming message event.
    // Sender message listener will be invoked.
    // self._messageBus.send(event.senderId, event.data);
    console.log(this.state.debugLog);
  }

  render() {
    return (
      <div className="Receiver">
          <h1>Receiver</h1>
          <video className="Video" ref={(v) => { this.video = v; }} />

          <div className="debug-log">
            <h2>Debug Log</h2>
            {this.state.debugLog.map((v, i) => {
              return <div key={i}>{v}</div>;
            })}
          </div>
      </div>
    );
  }
}


export default Receiver;
