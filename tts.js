const uuid = require('uuid');
const { exec } = require('child_process');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 8888;

app.get('/say', (req, res) => {
  //set path info
  var ttsPath = "/service/DECTalk4_win32_bin";
  var tmp = "/tmp/";

  //set dangerous characters, decode the get string, remove dangerous characters
  var dangerChar = /("|&|\/|\\|\*|\+|_|`|~|\(|\))/g;
  var data = decodeURIComponent(req.query.text);
  data = data.replace(dangerChar, '');

  //generate filename, write data to file
  var filename = uuid.v4();
  fs.writeFile(`${tmp}${filename}.tts`, data, function (err) { if (err) return console.log(err); } );

  //generate wav file using tts engine
  var cmd = `cd ${ttsPath} && wine say.exe -pre "[:phoneme on]" -w ${tmp}${filename}.wav < ${tmp}${filename}.tts`;
  var child = exec(cmd);
  child.stdout.pipe(process.stdout);
  child.on('exit', function () {
    //return the wav file
    var fileWithPath = `${tmp}${filename}.wav`;
    res.download(fileWithPath, 'say.wav');
  });
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
