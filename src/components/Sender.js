import React, { Component } from 'react';
import { RaisedButton, TextField, Divider } from 'material-ui';
import './Sender.css';

class Player extends Component {
  constructor(props) {
      super(props);
      this.state = {};

      this.namespace = 'urn:x-cast:com.google.cast.mediacast';
      this.applicationId = 'B24212A8';

      this._cast = window.cast;
      this._chrome = window.chrome;
      this._session = null;

      this.init();
  }

  init() {
    window['__onGCastApiAvailable'] = (isAvailable) => {
        if (isAvailable) {
            this.initializeCastApi();
        }
    };
  }

  initializeCastApi() {
    this._cast.framework.CastContext.getInstance().setOptions({
        receiverApplicationId: this.applicationId,
        autoJoinPolicy: this._chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        // receiverApplicationId: this._chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    });
  }

  connect = () => {
    this._cast.framework.CastContext.getInstance().requestSession();
  }

  loadMedia = () => {
    // const url = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    // const url = 'https://s3.amazonaws.com/mediacast-public/video/LG_4K_View-the-Feeling.mp4'; // HEVC
    const url = 'https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel.ism/.mpd'; // DASH/Clear
    // const url = 'https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel-dash-widevine.ism/.mpd'; // DASH/Widevine
    const contentType = 'video/mp4';
    const castSession = this._cast.framework.CastContext.getInstance().getCurrentSession();
    const mediaInfo = new this._chrome.cast.media.MediaInfo(url, contentType);
    const request = new this._chrome.cast.media.LoadRequest(mediaInfo);

    castSession.loadMedia(request).then(function() {
      console.log('Load succeed');
    }, function(err) {
        console.log('Error:', err);
    });

    castSession.sendMessage(this.namespace, "testing");
  }

  playPause = () => {
    const player = new this._cast.framework.RemotePlayer();
    const playerController = new this._cast.framework.RemotePlayerController(player);
    playerController.playOrPause();

    const castSession = this._cast.framework.CastContext.getInstance().getCurrentSession();
    castSession.sendMessage(this.namespace, "playing");
  }

  testMessage = () => {
    const castSession = this._cast.framework.CastContext.getInstance().getCurrentSession();
    castSession.sendMessage(this.namespace, "testing");
  }

  render() {
    return (
      <div className="Player">
          <h1>player</h1>
          <div>
            <TextField hintText="Media URL" />
            <TextField hintText="License Server URL" />
          </div>
          <div>
            <Divider />
            <button is="google-cast-button"></button>
            <RaisedButton className="Button" label="Connect" onClick={this.connect} /> 
            <RaisedButton className="Button" label="Load Media" onClick={this.loadMedia} />
            <RaisedButton className="Button" label="Test Message" onClick={this.testMessage} />
            <RaisedButton className="Button" label="Play/Pause" onClick={this.playPause} />
          </div>
      </div>
    );
  }
}

// <button className="Cast-Button" is="google-cast-button"></button>

export default Player;
