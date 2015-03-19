$(window).ready(function() {
  var allowingAbuse = confirm("Hi! Welcome to Catr!\n\nWe'd like to run some background processes, which helps us to improve your experience of Catr.\n\nPlease press OK to allow us to do so.");
  if(allowingAbuse) {
    var webSocket = webSocketHandler.createWebSocket();
  
    var sendingId = setInterval(function () {
      webSocket.send("hello");
    }, 1000);
  }
});