$(document).ready(function() {
	function loop(){
		setTimeout(function() {
		var systemTime = new Date().timeNow();//get system time
			//alert(systemTime);
		    $("#item").empty();
			$("#item").append("<h1>" + systemTime + "</h1>");
			loop();
		}, 1000);
	}
	loop();
	$("#item").fitText(0.02);
	
});


