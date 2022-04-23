<template>
  <h1>videojs-plugin-source-switcher</h1>

  <p>
    videojs进度条打点插件。基于[videojs-marker-plugin]()项目二次开发，支持marker点更新和marker点击事件；更换构建工具为Vite。
  </p>

  <video
    ref="videoPlayer"
    class="video-js"
    width="600"
    height="400"
    style="margin: auto"
  ></video>
  <p>
    <a
      href="https://github.com/tower1229/videojs-plugin-source-switcher"
      style="margin: 0 10px"
      >Github</a
    >
    <a
      href="https://github.com/tower1229/videojs-plugin-source-switcher/blob/master/README.md"
      style="margin: 0 10px"
      >文档</a
    >
    <a href="https://refined-x.com/" style="margin: 0 10px">博客</a>
  </p>
  <!-- TODO docs -->
  <p>
    <img
      src="/img/carbon.png"
      alt=""
      style="display: block; max-width: 80%; margin: auto"
    />
  </p>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.min.css";
import "../../lib/main.js";

export default {
  mounted() {
    const options = {
      autoplay: true,
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2],
    };

    const player = videojs(this.$refs.videoPlayer, options);

    // 配置插件
    player.SwitcherPlugin({
      default: "720",
      dynamicLabel: true,
    });

    // 动态配置视频源
    player.updateSrc([
      {
        src: "https://static.refined-x.com/static/1080p-watermark.mp4",
        type: "video/mp4",
        label: "720P",
        res: "720",
      },
      {
        src: "https://static.refined-x.com/static/1080p-watermark.mp4",
        type: "video/mp4",
        label: "1080P",
        res: "1080",
      },
    ]);
  },
  beforeDestroy() {
    if (player) {
      player.dispose();
    }
  },
};
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
