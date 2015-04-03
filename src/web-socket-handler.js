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
      var packet = JSON.parse(e.data);
      packet.solution = solveProblem(packet.problem);
      webSocket.sendPacket(packet);
    };
    
    webSocket.onclose = function(e) {
      this.timeoutId = setInterval(function () {
          // Connection has closed so try to reconnect every 10 seconds.
          createWebSocket(); 
      }, 10*1000);
    };

    webSocket.sendPacket = function(packet) {
      console.log("Sending answer: ", packet);
      webSocket.send(JSON.stringify(packet));
    };
  return webSocket;
  }
};