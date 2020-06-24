"use strict";

const Command = require("./Command");

// Koishi插件名
module.exports.name = "osu-beatmap-info";

// 插件处理和输出
module.exports.apply = (ctx) => {
    ctx.middleware(async (meta, next) => {
        try {
            let message = meta.message;
            if (!message.length || message.length < 5) return next();
            if (message.substring(0, 1) !== "!" && message.substring(0, 1) !== "！") return next();
            let reply = await new Command(message.substring(1).toLowerCase()).apply();
            if (reply !== "") return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n" + reply);
            return next();
        } catch (ex) {
            console.log(ex);
            return next();
        }
    });
};
