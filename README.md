# videojs-plugin-source-switcher

videojs 视频源切换插件.基于[videojs-resolution-switcher]()项目二次开发, 支持 videojs^7.0.0; 更换构建工具为 Vite.

![preivew](public/img/album.png)

## Install

```bash
npm i @tower1229/videojs-plugin-source-switcher -S
```

```bash
import '@tower1229/videojs-plugin-source-switcher';
import '@tower1229/videojs-plugin-source-switcher/dist/style.css';

```

## Use

```js
const player = videojs(this.$refs.videoPlayer, options);

// 配置插件
player.SwitcherPlugin();

// 动态配置视频源
player.updateSrc([
  {
    src: "https://static.refined-x.com/static/1080p-watermark.mp4",
    type: "video/mp4",
    label: "1080P",
    res: "1080",
  },
  {
    src: "https://static.refined-x.com/stream/1080p-720.m3u8",
    type: "application/x-mpegURL",
    label: "720P",
    res: "720",
  },
]);
```

或者, 也可以使用`<source>`标签同步配置视频源：

```html
<video ref="videoPlayer" class="video-js">
  <source
    src="https://static.refined-x.com/static/1080p-watermark.mp4"
    type="video/mp4"
    label="1080P"
    res="1080"
  />
  <source
    src="https://static.refined-x.com/stream/1080p-720.m3u8"
    type="application/x-mpegURL"
    label="720P"
    res="720"
  />
</video>
```

## Options

| 属性    | 说明                                                                                                                                             | 类型   | 可选                 | 默认  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------- | ----- |
| default | 默认播放的视频源. 非必填. 若值为'high'将取`res`值最大的视频; 若值为'low'将取`res`值最小的视频; 若值为其他将从列表中寻找`res`字段与之相匹配的视频 | String | 'low' / 'high' / RES | 'low' |

## Events

| 名称             | 说明                         | 参数  |
| ---------------- | ---------------------------- | ----- |
| resolutionchange | 视频源切换事件，其实没什么用 | event |

## Extensions

| 名称                              | 说明                                                            | 参数                                                                                                                               |
| --------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| player.updateSrc(sources)         | 动态设置视频源方法.                                             | sources: [Object,...]. 对象格式：`{src: String, type: String, label: String [, res: String]}`. `res`将作为视频质量排序依据, 非必填 |
| player.currentResolution([label]) | 获取/设置当前视频源方法.                                        | label: String.                                                                                                                     |
| `<source label="" res="">`        | 为`<source>`标签扩展支持"label"和"res"属性, 用于同步设置视频源. | label: String; [res: String.]                                                                                                      |
