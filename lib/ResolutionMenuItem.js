import videojs from "video.js";

const MenuItem = videojs.getComponent("MenuItem");

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
    this.selected(selectd);
  }
}

ResolutionMenuItem.prototype.contentElType = "button";
videojs.registerComponent("ResolutionMenuItem", ResolutionMenuItem);

export default ResolutionMenuItem;
