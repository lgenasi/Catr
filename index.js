var http = require('http');
var express = require('express');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk("mongodb://catr:YoloSwaggins1@ds039211.mongolab.com:39211/heroku_app35008331");

var pkg = require('./package');
var route = pkg.route;
var port = pkg.port;

var WebSocketServer = require('ws').Server;

var app = express();
app.use("/src", express.static(__dirname + '/src'));
app.use("/lib", express.static(__dirname + '/bower_components'));
var server = http.createServer(app);

app.use(function(req,res,next){
  req.db = db;
  next();
});


var clients = [];
var wss = new WebSocketServer({server: server});
wss.broadcast = function(data, ws) {
  for (var i in this.clients) {
    if (this.clients[i] !== ws) {
      this.clients[i].send(data);
    }
  }
};

var unprocessedCollection = db.get('unprocessed');
var processingCollection = db.get('processing');
var processedCollection = db.get('processed');

wss.on('connection', function(ws) {
  ws.session = {};
  ws.session.state = "new";
  ws.session.id = ws._socket.remoteAddress;
  ws.session.problem = null;
  console.log("New client.", {sessionId: ws.session.id});

  ws.restoreExistingProblem = function() {
    if(ws.session.problem != null) {
      console.log({sessionId: ws.session.id}, " has a unprocessed problem");

      processingCollection.findById(ws.session.problem._id, function(err, doc) {
        if (err) {
          console.log(err);
        } else {

          processingCollection.remove(doc, function(removeErr) {
            if(removeErr) {
              console.log(removeErr);
            } else {
              console.log({sessionId: ws.session.id}, " has removed its unprocessed problem");
              unprocessedCollection.insert(doc, function(insertErr, insertDoc) {
                if(insertErr) {
                  console.log(insertErr);
                } else {
                  console.log({sessionId: ws.session.id}, " has sucessfully restored its problem");
                }
              });
            }
          });
        }
      });
    }
  };

  ws.on('message', function(data) {
    ws.session.state = "solved";
    console.log("Got data: " + data + " from client at " + ws.session.id);
    
    if(data !== "null") {
      var packet = JSON.parse(data); 
      
      console.log("Moving document " + packet._id + " from processing to processed");
    
      processingCollection.findById(packet._id, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          processingCollection.remove(doc, function(removeErr){
            if (removeErr) {
              console.log(removeErr);
            } else {
              processedCollection.insert(packet, function(insertErr, insertDoc){
                if (insertErr) {
                  console.log(insertErr);
                }
              });
            }
          });
        }
      });         
    } else {
      console.log("Data is null. Ignoring.");
    }

    console.log("Counting problems");
    unprocessedCollection.find({}, function(err, docs){
      if(err) {
        console.log(err);
      } else {
        if (docs.length < 50) {
          console.log("Only " +docs.length+ " unsolved problems remaining. Generating new problems.")
          var problems = [];
          for (var i = 0; i < 50; i++) {
            var problem = {problem: Math.floor(Math.random() * (10000 - 1000)) + 1000};
            problems.push(problem);
          }

          unprocessedCollection.insert(problems, function(err, doc) {
            if (err) {
              console.log(err);
            } else {
              console.log("Success inserting new problems.");
            }
          });
        }

        console.log("Finding problem to send.");
        unprocessedCollection.findOne({}).on('success', function (doc) {
          ws.session.state = "processing";
          unprocessedCollection.remove(doc, function(removeErr){
            if (removeErr) {
              console.log(removeErr);
            } else {
              processingCollection.insert(doc, function(insertErr, insertDoc){
                if (insertErr) {
                  console.log(insertErr);
                }
              });
            }
          });

          ws.session.problem = doc;
          ws.send(JSON.stringify(doc), function ack(error) {
            console.log("Warning in sending problem: ", error);
            ws.restoreExistingProblem();
          });
        });

      }
    });
  }); 

  ws.on('close', function close() {
    console.log("Connection closed.", {sessionId: ws.session.id});
    clients.splice(clients.indexOf(ws), 1);
    console.log({connections: clients.length});
    ws.restoreExistingProblem();    
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