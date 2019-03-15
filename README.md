# mediacast
> Google Cast - Chrome Sender & CAF Player for testing Media Playback

<p align="center"><img src="src/assets/clapper.png"></img></p>

https://alfg.github.io/mediacast/

** Works on Google Chrome only!

## Features
* MP4
* Adaptive Streaming - DASH / SmoothStreaming / HLS
* DRM - Widevine / PlayReady

## TODO
* Support more container formats
* HLS (and AES-128, SAMPLE-AES, Widevine) support
* Subtitles & closed captions support (WebVTT/TTML)
* Audio Track selection
* Video Track selection (currently not supported by CAF Receiver API)

## Install

### Development
Mediacast is built with [VUE.JS](https://vuejs.org) and the [Google Cast SDK](https://developers.google.com/cast/docs/developers).

* [CAF Receiver](https://developers.google.com/cast/docs/caf_receiver/)
* [Chrome Sender](https://developers.google.com/cast/docs/chrome_sender/)

```
npm install
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Deploy
```
npm run deploy
```

### Docker
```
docker build -t mediacast .
docker run -it -p 8080:80 --rm mediacast
```

* Load `http://localhost:8080/mediacast` in Google Chrome.

## Resources
* https://developers.google.com/cast/docs/developers
* https://cast.google.com/publish/#/overview
* https://developers.google.com/cast/docs/media

## License
MIT
