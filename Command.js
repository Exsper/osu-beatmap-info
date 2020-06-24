"use strict";

const utils = require("./utils");
const BeatmapObject = require("./BeatmapObject");
const ApiRequest = require("./ApiRequest");

class Command {
    constructor(message) {
        this.message = message;

        this.beatmapId;
        this.options = {};
    }

    /**
     * 拆出指令和参数
     * @param {RegExp} commandReg 
     * @returns {Boolean} 消息是否符合指令形式
     */
    cutCommand() {
        const mr = /^([a-zA-Z]+)/i.exec(this.message);
        if (mr === null) return false;
        else {
            this.commandString = mr[1].toLowerCase();
            this.argString = this.message.substring(this.commandString.length).trim();
            return true;
        }
    }

    /**
     * 分析argString
     */
    getArgObject() {
        let ar;
        ar = /^([0-9]+)/.exec(this.argString);
        if (!ar) throw "请输出正确的beatmapId";
        else this.beatmapId = parseInt(ar[1]);
        ar = /[+＋]([a-zA-Z0-9]+)/i.exec(this.argString);
        if (ar) this.options.mods = utils.getEnabledModsValue(ar[1]);
        ar = /([0-9]+)[xX]/.exec(this.argString);
        if (ar) this.options.combo = parseInt(ar[1]);
        ar = /([0-9]{1,}[.]?[0-9]*?)[%]/.exec(this.argString);
        if (ar) this.options.acc = parseFloat(ar[1]);
        ar = /([0-9]+)[mM]/.exec(this.argString);
        if (ar) this.options.nmiss = parseInt(ar[1]);
    }

    async apply() {
        try {
            const toMappoolRowCmd = "mappoolrow";
            const toCalPPStringCmd = "calpp";
            if (!this.cutCommand()) return "";
            if ((this.commandString !== toMappoolRowCmd) && (this.commandString !== toCalPPStringCmd)) return "";
            this.getArgObject();
            let beatmapInfo = await ApiRequest.getBeatmapsById(this.beatmapId);
            if (beatmapInfo.length<=0) return "查询不到该beatmap";
            let beatmapObject = new BeatmapObject(beatmapInfo[0], this.options);
            if (this.commandString === toMappoolRowCmd) return await beatmapObject.toMappoolRow();
            if (this.commandString === toCalPPStringCmd) return await beatmapObject.toString();
            return "";
        }
        catch (ex) {
            return ex;
        }
    }

}

module.exports = Command;