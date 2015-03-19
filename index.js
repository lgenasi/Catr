var http = require('http');
var express = require('express');

var pkg = require('./package');
var route = pkg.route;
var port = pkg.port;

var WebSocketServer = require('ws').Server;

var app = express();
app.use("/src", express.static(__dirname + '/src'));
app.use("/lib", express.static(__dirname + '/bower_components'));
var server = http.createServer(app);

var clients = [];
var wss = new WebSocketServer({server: server});
wss.broadcast = function(data, ws) {
  for (var i in this.clients) {
    if (this.clients[i] !== ws) {
      this.clients[i].send(data);
    }
  }
};

wss.on('connection', function(ws) {
  ws.session = {};
  ws.session.id = ws._socket.remoteAddress;
  console.log("New client.", {sessionId: ws.session.id});

  ws.on('message', function(data) {
    console.log(data);
    wss.broadcast("sending data");
  });

  ws.on('close', function close() {
    console.log("Connection closed.", {sessionId: ws.session.id});
    clients.splice(clients.indexOf(ws), 1);
    console.log({connections: clients.length});
  });
  clients.push(ws);
  console.log({connections: clients.length});
});

app.set('port', (process.env.PORT || 5000))

app.get(route, function (req, res) {
  res.sendfile('main.html');
});


server.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});