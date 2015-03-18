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
      console.log("received a message");      
      console.log(e.data);
    };
    
    webSocket.onclose = function(e) {
      this.timeoutId = setTimeout(function () {
          // Connection has closed so try to reconnect every 10 seconds.
          createWebSocket(); 
      }, 10*1000);
    };
  return webSocket;
  }
};

window.onload = function() {
  var webSocket = webSocketHandler.createWebSocket();
  
  var sendingId = setTimeout(function () {
    webSocket.send("hello");
  }, 1000);
}