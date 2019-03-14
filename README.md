# mediacast

> Google Cast - Chrome Sender & CAF Player for testing Media Playback

<p align="center"><img src="src/assets/clapper.png"></img></p>

https://alfg.github.io/mediacast/

** Works on Google Chrome only!

## Features
* MP4
* Adaptive Streaming - DASH / SmoothStreaming / HLS
* DRM - Widevine / PlayReady

## Install

### Development
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

## License
MIT
