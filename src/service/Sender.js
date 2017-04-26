// import { castApplicationId, castNamespace } from '../../../../../config.js';

/* CastSender initializes the Chromecast, creates a session when attempting to
 * cast, and sends messages (Youtube video IDs array) to the receiver app.
 */

export default class CastSender {
  constructor(options) {

    this.opt = options;
    this.session = null;
    this.namespace = this.opt.castNamespace || 'urn:x-cast:com.google.cast.mediacast';
    this.applicationId = this.opt.castApplicationId || 'B24212A8';
    this._playlist = null;

    this.initializeCastApi();
  }

  initializeCastApi() {

    // Create session to custom receiver.
    var sessionRequest = new chrome.cast.SessionRequest(this.applicationId);

    // Configure session.
    var apiConfig = new chrome.cast.ApiConfig(
      sessionRequest,
      this.sessionListener,
      this.receiverListener
    );

    // Intitialize cast.
    chrome.cast.initialize(apiConfig, this.onInitSuccess, this.onError);
  }

  play(playlist, cb) {
    var self = this;

    self._playlist = playlist;

    if (self.session !== null) {
      self.sendMessage(self._playlist);
    } else {
      chrome.cast.requestSession(onRequestSessionSuccess, onError);
    }

    function onRequestSessionSuccess(e) {
      self.session = e;
      self.sendMessage(self._playlist);
      cb(null);
    }

    function onError(e) {
      cb(e);
      console.log('Error launching cast: ', e);
    }
  }

  stop(cb) {
    var self = this;

    if (self.session !== null) {
      self.session.stop(onSuccess.bind(this, cb), onError);
    }

    function onSuccess(cb, e) {
      cb(null);
    }

    function onError(e) {
      cb(e);
      console.log('Error stopping cast: ', e);
    }
  }

  sendMessage(message) {
    var self = this;

    if (self.session !== null) {
      self.session.sendMessage(this.namespace, message, this.onSuccess.bind(this), this.onError);
    } else {
      console.log('Error sending message to cast.');
    }
  }

  sessionListener() {}

  receiverListener(e) {
    if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
      console.log('Casting ready.');
    }
  }

  onInitSuccess() {}

  onSuccess() {}

  onError(e) {
    console.log('Error: ', e);
  }
}