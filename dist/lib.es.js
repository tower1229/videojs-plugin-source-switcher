import videojs$1 from "video.js";
const MenuItem = videojs$1.getComponent("MenuItem");
class ResolutionMenuItem extends MenuItem {
  constructor(player, options) {
    const label = options.label;
    options.label = label;
    options.selected = label === player.currentResolution().label;
    options.selectable = true;
    options.multiSelectable = false;
    super(player, options);
    this.label = label;
    this.on(player, "resolutionchange", (e) => this.update(e));
  }
  handleClick(event) {
    super.handleClick();
    this.player().currentResolution(this.label);
  }
  update() {
    const selectd = this.label === this.player().currentResolution().label;
    console.log("menuitem update", selectd);
    this.selected(selectd);
  }
}
ResolutionMenuItem.prototype.contentElType = "button";
videojs$1.registerComponent("ResolutionMenuItem", ResolutionMenuItem);
const MenuButton = videojs$1.getComponent("MenuButton");
class ResolutionMenuButton extends MenuButton {
  constructor(player, options) {
    super(player);
    this.controlText("Quality");
    this.on(player, "loadstart", (e) => this.updateLabel(e));
    this.on(player, "updateSources", (e) => {
      console.log("player.on('updateSources')");
      this.updateLabel(e);
      this.update();
    });
  }
  createEl() {
    const el = super.createEl();
    this.labelElId_ = "vjs-playback-rate-value-label-" + this.id_;
    this.labelEl_ = videojs$1.dom.createEl("div", {
      className: "vjs-resolution-button-label",
      id: this.labelElId_,
      textContent: ""
    });
    el.appendChild(this.labelEl_);
    return el;
  }
  dispose() {
    super.dispose();
  }
  buildCSSClass() {
    return `vjs-resolution-button ${super.buildCSSClass()}`;
  }
  buildWrapperCSSClass() {
    return `vjs-resolution-button ${super.buildWrapperCSSClass()}`;
  }
  createItems() {
    console.log("createItems");
    this.sources = this.player().groupedSrc;
    const items = [];
    const list = this.sources && this.sources.label || {};
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        console.log(key);
        items.push(new ResolutionMenuItem(this.player(), {
          label: key,
          src: list[key],
          selected: key === (this.currentSelection ? this.currentSelection.label : false)
        }));
      }
    }
    return items;
  }
  updateLabel() {
    this.currentSelection = this.player().currentResolution();
    this.labelEl_.textContent = this.currentSelection ? this.currentSelection.label : "";
  }
}
videojs$1.registerComponent("ResolutionMenuButton", ResolutionMenuButton);
const version = "0.0.5";
var plugin = "";
let videojs;
if (window.videojs) {
  videojs = window.videojs;
  console.warn(`SwitcherPlugin:\u68C0\u6D4B\u5230window.videojs`);
} else {
  videojs = videojs$1;
}
const Plugin = videojs.getPlugin("plugin");
class SwitcherPlugin extends Plugin {
  constructor(player, options = {}) {
    super(player, options);
    player.updateSrc = function(src) {
      if (!Array.isArray(src) && src.length) {
        return player.src();
      }
      src = src.filter(function(source) {
        try {
          return player.canPlayType(source.type) !== "";
        } catch (e) {
          return true;
        }
      });
      this.currentSources = src.sort(compareResolutions);
      this.groupedSrc = bucketSources(this.currentSources);
      let chosen = chooseSrc(this.groupedSrc, this.currentSources);
      this.currentResolutionState = {
        label: chosen.label,
        sources: chosen.sources
      };
      player.trigger("updateSources");
      player.setSourcesSanitized(chosen.sources, chosen.label);
      player.trigger("resolutionchange");
      return player;
    };
    player.currentResolution = function(label) {
      if (label == null) {
        return this.currentResolutionState;
      }
      if (!this.groupedSrc || !this.groupedSrc.label || !this.groupedSrc.label[label]) {
        return;
      }
      let sources = this.groupedSrc.label[label];
      let currentTime = player.currentTime();
      let isPaused = player.paused();
      if (!isPaused && this.player().options_.bigPlayButton) {
        this.player().bigPlayButton.hide();
      }
      player.setSourcesSanitized(sources, label).one("loadeddata", function() {
        player.currentTime(currentTime);
        if (!isPaused) {
          player.play();
        }
        player.trigger("updateSources");
        console.log("player.trigger('updateSources');");
        player.trigger("resolutionchange");
      });
      return player;
    };
    player.setSourcesSanitized = function(sources, label) {
      this.currentResolutionState = {
        label,
        sources
      };
      player.src(sources.map(function(src) {
        return { src: src.src, type: src.type, res: src.res };
      }));
      return player;
    };
    function compareResolutions(a, b) {
      if (!a.res || !b.res) {
        return 0;
      }
      return +b.res - +a.res;
    }
    function bucketSources(src) {
      let resolutions = {
        label: {},
        res: {},
        type: {}
      };
      src.map(function(source) {
        for (let key in resolutions) {
          if (resolutions[key][source[key]] == null) {
            resolutions[key][source[key]] = [];
          }
          resolutions[key][source[key]].push(source);
        }
      });
      return resolutions;
    }
    function chooseSrc(groupedSrc, src) {
      let selectedRes = options.default || "low";
      let selectedLabel = "";
      if (selectedRes === "high") {
        selectedRes = src[0].res;
        selectedLabel = src[0].label;
      } else if (selectedRes === "low" || !groupedSrc.res[selectedRes]) {
        selectedRes = src[src.length - 1].res;
        selectedLabel = src[src.length - 1].label;
      } else if (groupedSrc.res[selectedRes]) {
        selectedLabel = groupedSrc.res[selectedRes][0].label;
      }
      return {
        res: selectedRes,
        label: selectedLabel,
        sources: groupedSrc.res[selectedRes]
      };
    }
    let menuButton = new ResolutionMenuButton(player);
    player.controlBar.el_.insertBefore(menuButton.el_, player.controlBar.getChild("fullscreenToggle").el_);
    if (player.options_.sources.length > 1) {
      player.updateSrc(player.options_.sources);
    }
  }
  dispose() {
    super.dispose();
  }
}
SwitcherPlugin.defaultState = {};
SwitcherPlugin.VERSION = version;
videojs.registerPlugin("SwitcherPlugin", SwitcherPlugin);
export { SwitcherPlugin as default };
