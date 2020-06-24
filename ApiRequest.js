"use strict";

const querystring = require('querystring');
const https = require('https');
const apiToken = require("./apiToken.json").apiToken;

class OsuApi {
    static apiRequest(options) {
        return new Promise((resolve, reject) => {
            const contents = querystring.stringify(options.data);
            const requestOptions = {
                host: "osu.ppy.sh",
                port: 443,
                type: 'https',
                method: 'GET',
                path: '/api' + options.path + '?' + contents,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': contents.length
                }
            }
            let _data = '';

            // console.log("发送请求：" + requestOptions.host + requestOptions.path);

            const req = https.request(requestOptions, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    _data += chunk;
                });
                res.on('end', function () {
                    resolve(_data);
                });
                res.on('error', function (e) {
                    console.dir('problem with request: ' + e.message);
                    reject(e)
                });
            });
            req.write(contents);
            req.end();
        })
    }

    static async apiCall(_path, _data) {
        return await this.apiRequest({
            path: _path,
            data: _data
        }).then(data => {
            try {
                if (!data || data === "null") return { code: 404 };
                return JSON.parse(data);
            }
            catch (ex) {
                console.log(ex);
                return { code: "error" };
            }
        });
    }

    static async getBeatmaps(options) {
        const resp = await this.apiCall('/get_beatmaps', options);
        return resp;
    }

    static async getBeatmapsById(beatmapId) {
        const resp = await this.getBeatmaps({k: apiToken, b: beatmapId});
        return resp;
    }
}

module.exports = OsuApi;
