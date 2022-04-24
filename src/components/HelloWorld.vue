<template>
  <h1>videojs-plugin-source-switcher</h1>

  <p>
    videojs
    视频源切换插件。基于videojs-resolution-switcher项目二次开发，支持videojs^7.0.0；更换构建工具为
    Vite。
  </p>
  <div style="width: 800px; margin: auto">
    <video ref="videoPlayer" class="video-js vjs-fluid">
      <!-- <source
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
      /> -->
    </video>

    <p>
      <a href="https://github.com/tower1229/videojs-plugin-source-switcher">
        Github
      </a>
      <a
        href="https://github.com/tower1229/videojs-plugin-source-switcher/blob/master/README.md"
      >
        文档
      </a>
      <a href="https://refined-x.com/"> 博客 </a>
    </p>
    <p>
      <img
        src="/img/carbon.png"
        style="
          display: block;
          max-width: 100%;
          margin: auto;
          box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
        "
      />
    </p>
  </div>
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
    player.SwitcherPlugin();

    // 动态配置视频源
    player.updateSrc([
      {
        src: "https://static.refined-x.com/static/1080p-watermark.mp4",
        type: "video/mp4",
        label: "1080P",
      },
      {
        src: "https://static.refined-x.com/stream/1080p-720.m3u8",
        type: "application/x-mpegURL",
        label: "720P",
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
  margin: 0 10px;
}
</style>
