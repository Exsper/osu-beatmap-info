"use strict";

const utils = require("./utils");
const MapCalculater = require("./MapCalculater");

class BeatmapObject {
    constructor(beatmap, options) {

        this.beatmapId = parseInt(beatmap.beatmap_id);
        this.beatmapSetId = beatmap.beatmapset_id;
        this.mode = parseInt(beatmap.mode);
        this.artist = beatmap.artist;
        this.title = beatmap.title;
        this.diff = beatmap.version;
        this.creator = beatmap.creator;
        this.approved = utils.getApprovedString(beatmap.approved);
        this.bpm = parseFloat(beatmap.bpm);
        this.length = parseInt(beatmap.hit_length);
        this.maxCombo = parseInt(beatmap.max_combo);
        this.cs = parseFloat(beatmap.diff_size);
        this.ar = parseFloat(beatmap.diff_approach);
        this.od = parseFloat(beatmap.diff_overall);
        this.hp = parseFloat(beatmap.diff_drain);
        this.stars = parseFloat(beatmap.difficultyrating);

        this.options = options;
        //(options.mods) ? this.mods = options.mods : 0;
        //(options.combo) ? this.combo = options.combo : this.maxCombo;
        //(options.nmiss) ? this.nmiss = options.nmiss : 0;
        //(options.acc) ? this.acc = options.acc : 100;
    }

    async calculateWithMods() {
        let mapCalculater = new MapCalculater(this.beatmapId, this.maxCombo, this.options);
        let resultPP = await mapCalculater.calculatePP();
        let resultStat = mapCalculater.calculateStatWithMods({ ar: this.ar, od: this.od, hp: this.hp, cs: this.cs }, this.options.mods);

        this.stars = parseFloat(resultPP.stars);
        this.pp = parseFloat(resultPP.pp);
        this.calResult = resultPP.string;

        this.cs = resultStat.cs;
        this.ar = resultStat.ar;
        this.od = resultStat.od;
        this.hp = resultStat.hp;
        this.bpm = this.bpm * resultStat.speed_mul;
        this.length = this.length / resultStat.speed_mul;
    }

    async toString() {
        if (this.mode !== 0) return "只支持查询std";
        await this.calculateWithMods();
        let output = "";
        output = output + "谱面 " + this.beatmapId + " " + this.artist + " - " + this.title + " (" + this.creator + ") [" + this.diff + "]\n";
        output = output + "set： " + this.beatmapSetId + " 模式： " + utils.getModeString(this.mode) + " 状态： " + this.approved + "\n";
        output = output + "CS" + this.cs.toFixed(1) + "  AR" + this.ar.toFixed(1) + "  OD" + this.od.toFixed(1) + "  HP" + this.hp.toFixed(1) + "\n";
        output = output + "BPM: " + this.bpm.toFixed(0) + " stars: " + this.stars.toFixed(2) + " max Combo： " + this.maxCombo + "  时长： " + utils.gethitLengthString(this.length) + "\n";
        output = output + "\n结算 combo: ";
        (this.options.combo) ? output = output + this.options.combo : output = output + this.maxCombo;
        output = output + "  ";
        (this.options.acc) ? output = output + this.options.acc + "%": output = output + "100%";
        output = output + "  ";
        (this.options.nmiss) ? output = output + this.options.nmiss + " miss": output = output + "0 miss";
        output = output + "\n";
        output = output + "使用mod：" + utils.getScoreModsString(this.options.mods)+ "\n";
        output = output + this.calResult + "\n";
        output = output + "osu.ppy.sh/b/" + this.beatmapId;
        return output;
    }

    async toMappoolRow() {
        if (this.mode !== 0) return "只支持查询std";
        await this.calculateWithMods();
        let output = "";
        output = output + this.beatmapSetId + " " + this.artist + " - " + this.title + "[" + this.diff + "] // " + this.creator + " ★" + this.stars.toFixed(2) + " BPM: " + this.bpm.toFixed(0) + " Length: " + utils.gethitLengthString(this.length) + "(" + this.maxCombo + "x)\n";
        output = output + "osu.ppy.sh/b/" + this.beatmapId;
        return output;
    }
}

module.exports = BeatmapObject;