$(window).ready(function() {
  $('#abuseDialog').modal('show');
  $('.carousel').carousel({
    interval: false
  }) 
  var allowAbuseBtn = document.getElementById("allowAbuseBtn");
  allowAbuseBtn.onclick = function(){
    $('#abuseDialog').modal('hide');
    var webSocket = webSocketHandler.createWebSocket();
    
    
    var sendingId = setInterval(function () {
    	if(webSocket.readyState == 1) {
    		console.log("Sending initial packet.");
    		webSocket.send("null");
    		clearInterval(sendingId);
    	}
    }, 1000);
  }
});