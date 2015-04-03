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
    		console.log("sending initial packet");
    		webSocket.sendPacket(null, null);
    		clearInterval(sendingId);
    	}
    }, 1000);
  }
});