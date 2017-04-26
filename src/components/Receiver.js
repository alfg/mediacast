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

      // this.init();
  }

  componentDidMount() {
    console.log('Loading...');

    this._cast.receiver.logger.setLevelValue(this._cast.receiver.LoggerLevel.DEBUG);
    this._cast.player.api.setLoggerLevel(this._cast.player.api.LoggerLevel.DEBUG);





    // window.mediaManager = new cast.receiver.MediaManager(mediaElement);
    // window.defaultOnLoad = mediaManager.onLoad.bind(mediaManager);
    // mediaManager.onLoad = function(event) {
    //   if (window.player !== null) {
    //     player.unload();
    //     window.player = null;
    //   }
    // }
    // host.onError = function(errorCode) {
    //   console.log("Fatal Error - " + errorCode);
    //   if (window.player) {
    //     window.player.unload();
    //     window.player = null;
    //   }
    // };

    // const protocol = cast.player.api.CreateDashStreamingProtocol(host);
    // window.player = new cast.player.api.Player(host);
    // window.player.load(protocol, initStart);

    // window.player = null;

    this._castReceiverManager = this._cast.receiver.CastReceiverManager.getInstance();

    // Binding receiver manager events.
    // self._castReceiverManager.onReady = self.receiverManager_onReady.bind(this);
    // self._castReceiverManager.onSenderConnected = self.receiverManager_onSenderConnected.bind(this);
    // self._castReceiverManager.onSenderDisconnected = self.receiverManager_onSenderDisconnected.bind(this);
    // self._castReceiverManager.onSystemVolumeChanged = self.receiverManager_onSystemVolumeChanged.bind(this);

    // Create a CastMessageBus to handle messages for a custom namespace.
    this._messageBus = this._castReceiverManager.getCastMessageBus(this.namespace);
    this._messageBus.onMessage = this.messageBus_onMessage.bind(this);

    
    console.log('Application is ready, starting system');
    this._castReceiverManager.start({ statusText: "Application starting..."});
  }

  loadVideo() {
    const mediaElement = this.video;
    // const url = 'https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel.ism/.mpd';
    const url = 'https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel-dash-widevine.ism/.mpd'; // Widevine.
    const licenseUrl = 'https://widevine-proxy.appspot.com/proxy';
    const host = new this._cast.player.api.Host({ 'mediaElement': mediaElement, 'url': url, 'licenseUrl': licenseUrl });

    host.onError = function(errorCode) {
      console.log("Fatal Error - " + errorCode);
      if (window.player) {
        window.player.unload();
        window.player = null;
      }
    };

    this._player = new this._cast.player.api.Player(host);


    const protocol = this._cast.player.api.CreateDashStreamingProtocol(host);

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
