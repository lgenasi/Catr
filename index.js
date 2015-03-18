var http = require('http');
var express = require('express');

var pkg = require('./package');
var route = pkg.route;
var port = pkg.port;

var exec = require('child_process').exec;

var app = express();
app.use("/src", express.static(__dirname + '/src'));
app.use("/lib", express.static(__dirname + '/lib'));
var server = http.createServer(app);

app.set('port', (process.env.PORT || 5000))

app.get(route, function (req, res) {
  res.sendfile('main.html');
});


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});