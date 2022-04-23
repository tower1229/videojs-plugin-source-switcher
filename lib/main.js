import videojs from 'video.js';
import ResolutionMenuButton from './ResolutionMenuButton';
import { version as VERSION } from '../package.json';
import "./plugin.less";
const Plugin = videojs.getPlugin('plugin');

class SwitcherPlugin extends Plugin {

    constructor(player, options) {
        super(player);

        const settings = videojs.mergeOptions({
            ui: true
        }, options);

        /**
           * Updates player sources or returns current source URL
           * @param   {Array}  [src] array of sources [{src: '', type: '', label: '', res: ''}]
           * @returns {Object|String|Array} videojs player object if used as setter or current source URL, object, or array of sources
           */
        player.updateSrc = function (src) {
            //Return current src if src is not given
            if (!Array.isArray(src) && src.length) { return player.src(); }

            // Only add those sources which we can (maybe) play
            src = src.filter(function (source) {
                try {
                    return (player.canPlayType(source.type) !== '');
                } catch (e) {
                    // If a Tech doesn't yet have canPlayType just add it
                    return true;
                }
            });
            //Sort sources
            this.currentSources = src.sort(compareResolutions);
            this.groupedSrc = bucketSources(this.currentSources);
            // Pick one by default
            let chosen = chooseSrc(this.groupedSrc, this.currentSources);
            this.currentResolutionState = {
                label: chosen.label,
                sources: chosen.sources
            };

            player.trigger('updateSources');
            player.setSourcesSanitized(chosen.sources, chosen.label);
            player.trigger('resolutionchange');
            return player;
        };

        /**
         * Returns current resolution or sets one when label is specified
         * @param {String}   [label]         label name
         * @param {Function} [customSourcePicker] custom function to choose source. Takes 2 arguments: sources, label. Must return player object.
         * @returns {Object}   current resolution object {label: '', sources: []} if used as getter or player object if used as setter
         */
        player.currentResolution = function (label, customSourcePicker) {
            if (label == null) { return this.currentResolutionState; }

            // Lookup sources for label
            if (!this.groupedSrc || !this.groupedSrc.label || !this.groupedSrc.label[label]) {
                return;
            }
            let sources = this.groupedSrc.label[label];
            // Remember player state
            let currentTime = player.currentTime();
            let isPaused = player.paused();

            // Hide bigPlayButton
            if (!isPaused && this.player().options_.bigPlayButton) {
                this.player().bigPlayButton.hide();
            }

            // Change player source and wait for loadeddata event
            player.setSourcesSanitized(sources, label, customSourcePicker || settings.customSourcePicker)
                .one('loadeddata', function () {
                    player.currentTime(currentTime);
                    if (!isPaused) {
                        // Start playing and hide loadingSpinner (flash issue ?)
                        player.play();
                    }
                    player.trigger('updateSources');
                    console.log("player.trigger('updateSources');")
                    player.trigger('resolutionchange');
                });
            return player;
        };

        /**
         * Returns grouped sources by label, resolution and type
         * @returns {Object} grouped sources: { label: { key: [] }, res: { key: [] }, type: { key: [] } }
         */
        player.getGroupedSrc = function () {
            return this.groupedSrc;
        };

        player.setSourcesSanitized = function (sources, label, customSourcePicker) {
            this.currentResolutionState = {
                label: label,
                sources: sources
            };
            if (typeof customSourcePicker === 'function') {
                return customSourcePicker(player, sources, label);
            }
            player.src(sources.map(function (src) {
                return { src: src.src, type: src.type, res: src.res };
            }));
            return player;
        };

        /**
         * Method used for sorting list of sources
         * @param   {Object} a - source object with res property
         * @param   {Object} b - source object with res property
         * @returns {Number} result of comparation
         */
        function compareResolutions(a, b) {
            if (!a.res || !b.res) { return 0; }
            return (+b.res) - (+a.res);
        }

        /**
         * Group sources by label, resolution and type
         * @param   {Array}  src Array of sources
         * @returns {Object} grouped sources: { label: { key: [] }, res: { key: [] }, type: { key: [] } }
         */
        function bucketSources(src) {
            let resolutions = {
                label: {},
                res: {},
                type: {}
            };
            src.map(function (source) {
                for (let key in resolutions) {
                    if (resolutions[key][source[key]] == null) {
                        resolutions[key][source[key]] = [];
                    }
                    resolutions[key][source[key]].push(source);
                }
            });
            return resolutions;
        }

        /**
         * Choose src if option.default is specified
         * @param   {Object} groupedSrc {res: { key: [] }}
         * @param   {Array}  src Array of sources sorted by resolution used to find high and low res
         * @returns {Object} {res: string, sources: []}
         */
        function chooseSrc(groupedSrc, src) {
            let selectedRes = settings['default']; // use array access as default is a reserved keyword
            let selectedLabel = '';
            if (selectedRes === 'high') {
                selectedRes = src[0].res;
                selectedLabel = src[0].label;
            } else if (selectedRes === 'low' || selectedRes == null || !groupedSrc.res[selectedRes]) {
                // Select low-res if default is low or not set
                selectedRes = src[src.length - 1].res;
                selectedLabel = src[src.length - 1].label;
            } else if (groupedSrc.res[selectedRes]) {
                selectedLabel = groupedSrc.res[selectedRes][0].label;
            }

            return { res: selectedRes, label: selectedLabel, sources: groupedSrc.res[selectedRes] };
        }

        if (settings.ui) {
            let menuButton = new ResolutionMenuButton(player, settings);
            player.controlBar.el_.insertBefore(menuButton.el_, player.controlBar.getChild('fullscreenToggle').el_);
            // player.controlBar.addChild(menuButton)
        }
        if (player.options_.sources.length > 1) {
            // tech: Html5 and Flash
            // Create resolution switcher for videos form <source> tag inside <video>

            player.updateSrc(player.options_.sources);
        }
    };

    dispose() {
        super.dispose();
    }
}

// Define default values for the plugin's `state` object here.
SwitcherPlugin.defaultState = {};

// Include the version number.
SwitcherPlugin.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('SwitcherPlugin', SwitcherPlugin);

export default SwitcherPlugin;
