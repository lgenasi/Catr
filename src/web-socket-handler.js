var webSocketHandler = {
  host: location.origin.replace(/^http/, 'ws'),
  createWebSocket: function() {
    console.log("Attempting to connect...");
    var webSocket = new WebSocket(this.host);
    this.timeoutId = null;

    webSocket.onopen = function(e){
      console.log("Connected");
      clearTimeout(this.timeoutId);
    };

    webSocket.onmessage = function(e) {
      console.log("Received a problem");      
      console.log(e.data);
      var problem = parseInt(e.data);
      var solution = solveProblem(problem);
      webSocket.sendPacket(problem, solution);
    };
    
    webSocket.onclose = function(e) {
      this.timeoutId = setInterval(function () {
          // Connection has closed so try to reconnect every 10 seconds.
          createWebSocket(); 
      }, 10*1000);
    };

    webSocket.sendPacket = function(problem, solution) {
      console.log("Sending answer: ", problem, solution);
      webSocket.send(JSON.stringify({problem: problem, solution: solution}));
    };
  return webSocket;
  }
};