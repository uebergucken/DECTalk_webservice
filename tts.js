const uuid = require('uuid');
const { exec } = require('child_process');
const fs = require('fs');
const express = require('express');
const app = express();

var https = require('https');
var privateKey  = fs.readFileSync('service/cert/server.key', 'utf8');
var certificate = fs.readFileSync('service/cert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};


app.get('/say', (req, res) => {
  //set path info
  var ttsPath = "/service/DECTalk4_win32_bin";
  var tmp = "/tmp/";

  //set dangerous characters, decode the get string, remove dangerous characters
  var dangerChar = /("|&|\/|\\|\*|\+|_|`|~|\(|\))/g;
  var data;
  if (req.query.b64) {
      data = atob(req.query.text);
  }
  data = decodeURIComponent(req.query.text);
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
});

app.use((req, res, next) => {
   res.sendStatus(404);
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443);
