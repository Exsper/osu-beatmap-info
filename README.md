# osu-beatmap-info

## install 
```sh
npm install Exsper/osu-beatmap-info
```

## usage
```javascript
app.plugin(require('osu-beatmap-info'));
```
or
```javascript
module.exports = {
    plugins: [
        ['osu-beatmap-info'],
    ],
}
```
### osu apiToken
运行前请先创建apiToken.json文件：   
```javascript
apiToken.json
{
    "apiToken": "1234567890" // 这里填你的osu apitoken
}
```
