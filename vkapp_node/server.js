var fs = require('fs');
var http = require('http');
const path = require('path');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/handsapp.fun/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/handsapp.fun/fullchain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//httpServer.listen(3000);
httpsServer.listen(8443);
