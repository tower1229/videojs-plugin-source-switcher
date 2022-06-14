import videojs from "video.js";
import ResolutionMenuItem from "./ResolutionMenuItem";

const MenuButton = videojs.getComponent("MenuButton");

class ResolutionMenuButton extends MenuButton {
  constructor(player, options) {
    super(player);

    this.controlText("Quality");

    this.on(player, "loadstart", (e) => this.updateLabel(e));
    this.on(player, "updateSources", (e) => {
      this.updateLabel(e);
      this.update();
    });
  }

  createEl() {
    const el = super.createEl();
    this.labelElId_ = "vjs-playback-rate-value-label-" + this.id_;

    this.labelEl_ = videojs.dom.createEl("div", {
      className: "vjs-resolution-button-label",
      id: this.labelElId_,
      textContent: "",
    });

    el.appendChild(this.labelEl_);

    return el;
  }

  dispose() {
    // this.labelEl_ = null;

    super.dispose();
  }
  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `vjs-resolution-button ${super.buildCSSClass()}`;
  }

  buildWrapperCSSClass() {
    return `vjs-resolution-button ${super.buildWrapperCSSClass()}`;
  }

  createItems() {
    this.sources = this.player().groupedSrc;
    const items = [];
    const list = (this.sources && this.sources.label) || {};

    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        items.push(
          new ResolutionMenuItem(this.player(), {
            label: key,
            src: list[key],
            selected:
              key ===
              (this.currentSelection ? this.currentSelection.label : false),
          })
        );
      }
    }

    return items;
  }

  updateLabel() {
    this.currentSelection = this.player().currentResolution();
    this.labelEl_.textContent = this.currentSelection
      ? this.currentSelection.label
      : "";
  }
}

videojs.registerComponent("ResolutionMenuButton", ResolutionMenuButton);

export default ResolutionMenuButton;
