# videojs-plugin-source-switcher

videojs 视频源切换插件。基于[videojs-resolution-switcher]()项目二次开发，支持videojs@7.0.0；更换构建工具为 Vite。

![preivew](public/img/album.png)

## Install

```bash
npm i @tower1229/videojs-plugin-source-switcher -S
```

```bash
import '@tower1229/videojs-plugin-source-switcher';

```

## Use

```js
const player = videojs(this.$refs.videoPlayer, options);

// 配置插件
player.SwitcherPlugin({
  default: "high",
  dynamicLabel: true,
});

// 动态配置视频源
player.updateSrc([
  {
    src: "http://media.xiph.org/mango/tears_of_steel_1080p.webm",
    type: "video/webm",
    label: "360",
  },
  {
    src: "http://mirrorblender.top-ix.org/movies/sintel-1024-surround.mp4",
    type: "video/mp4",
    label: "720",
  },
]);
```
