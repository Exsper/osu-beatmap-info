"use strict";

const fetch = require('node-fetch')
const ojsama = require("ojsama");

class MapCalculater {
    /**
     * @param {Number} beatmapId 
     * @param {Number} maxcombo 
     * @param {Object} options 
     * @param {Number} [options.mods=0]
     * @param {Number} [options.combo=maxcombo]
     * @param {Number} [options.nmiss=0]
     * @param {Number} [options.acc=100]
     */
    constructor(beatmapId, maxcombo, options) {
        this.beatmapId = beatmapId;
        this.maxcombo = maxcombo;
        (options.mods) ? this.mods = options.mods : 0;
        (options.combo) ? this.combo = options.combo : maxcombo;
        (options.nmiss) ? this.nmiss = options.nmiss : 0;
        (options.acc) ? this.acc = options.acc : 100;
    }

    async getMap() {
        const rawBeatmap = await fetch(`https://osu.ppy.sh/osu/${this.beatmapId}`, { credentials: 'include' }).then(res => res.text());
        const { map } = new ojsama.parser().feed(rawBeatmap);
        return map;
    }

    calculateStatWithMods(values, mods) {
        return new ojsama.std_beatmap_stats(values).with_mods(mods);
    }

    async calculatePP() {
        // if (this.mode !== 0) return "";
        // 这个功能需要从官网下载.osu谱面文件
        const map = await this.getMap();
        const newstars = new ojsama.diff().calc({ map, mods: this.mods });
        const pp = ojsama.ppv2({
            stars: newstars,
            combo: this.combo,
            nmiss: this.nmiss,
            acc_percent: this.acc,
        });
        return { stars: newstars.total, pp: pp.total, string: "计算stars：" + newstars + "\n计算pp：" + pp };
    }

}

module.exports = MapCalculater;