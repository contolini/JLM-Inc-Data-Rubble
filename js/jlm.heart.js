$(document).ready(function() {

	var itemTime = [];
	var heartrate=0;
	var bpm=0;
	var timeloop=0;
	var tracknumberofparentloops = 0;
	var pulsetrackingofparentloops = 0;
	itemTime[0] = 50;
	var item = [];
	// main count
	var i = 0;
	var j = 0;
	var k = 0;
	var e = 0;
	var h3 = 0; 
	var itemcount = 0;
	
	var timer1 = 0;
	var timer2 = 0 
	var timerids;
	var timerstart=new Date().getTime();
	var nowtime=new Date().getTime();;
	var adjusttimer=0;
	var ptimerstart=new Date().getTime();
	var pnowtime=new Date().getTime();;
	var padjusttimer=0;
	var startingLoopIndex = 0;
	


	function getdata(callback){
		//make sure all the json loads before starting processing, because get data is asynchrous. 
		$.getJSON('json/heart.json', function(b) {
			$( b ).each(function( index ) {
				item[index] = [];
				//item[index][0] = b[index].id;
				item[index][0] = b[index].heartdate;
				item[index][1] = b[index].heartvalue;
				item[index][2] = b[index].heartwait;
				item[index][3] = b[index].datediff;
				//item[index][3] = b[index].item_dayval;
			});

			callback('hey');
		});
	}

	function initiateDataRequest(){

	    //get our JSON, make sure all the json loads before starting processing, because get data is asynchrous and you can't start calling items until they all load
	    //I kept getting errors on loading the json, so I'm going to keep trying till I get no errors. This is a total copout.
	    getdata(function(data){
	    	for (e = 0; e < 100000000; e++) { 
		    	try{
		    		getStartingLoopIndex();
					i = startingLoopIndex;
			        startloop();
			        break;
				}catch(err){}
	    	}
	    });
	}

	function getStartingLoopIndex(){
		var datedifference = diffStartDatetoToday();
    	for (j = 0; j < 100000000; j++) { 
		    if( item[j][3] == datedifference){
		    	//get the time from date and turn it into a comma delmited list slash array
		    	//split to get time (dates come as yyyy-mm-ddThh:mm:ss)
	    		var a = item[j][0].split("T");
	    		//split time into hh, mm, ss
	    		a = a[1].split(":"); 
	    		var systemTime = new Date().timeNow();//get system time
	    		//split system time into hh, mm, ss
	    		var b = systemTime.split(":");
				//Start compare, is hour the same or greater
	    		if (a[0] >= b[0]){
	    			//is minute the same or greater
	    			if(a[1] >= b[1]){
	    				//is seconds the same or greater
	    				if(a[2] >= b[2]){
	    					//cool than get the last index and get going
			    			startingLoopIndex = j - 1;
			    			break
			    		}
			    	}
	    		}
		    }
		} 
	}

	function startloop() { 


		(	
			//this is the loop that starts everything off. it first starts with changing the bpm and then calls the funtion to change the pulsing and background color
			function loop() {
				if( i == startingLoopIndex){
					timeloop = 0;
				}
				else{
					
					timeloop = ((item[i][2]*1000));
					if(isNaN(timeloop) || timeloop < 0)
						timeloop = 0;
				}
				clearTimeout(timer1);
		    	timer1 = setTimeout(function() {
		            runpulse();
		            i++;
		            loop();
			    }, timeloop);
			}()
		);
	}




	function runpulse() {
		
		if(debug==0){
			$("#heartrate").empty();
			$("#heartrate").append("<h1>" + item[i][1] + "</h1>");
		}
		//$("#heartrate").append("<h1>" + item[itemcount][1] + "</h1>");
		//$("#heartrate").append(item[itemcount][1] + "<br>"  +  item[itemcount][0] + "<br>" + item[itemcount][2] + "<br>" + item[itemcount][3]);
		bpm = item[i][1];
		//the math is to take 60 seconds, then divide it by the bpm and then turn it into milliseconds.
		heartrate = Math.round(((60/bpm) * 1000));
		
		repeat();
		
		//setTimeout and setInterval sucks when using dynamic values. it is inconsistent because it uses the CPU and if it gets busy, the duration lags
		function repeat() {
			
			ptimeloop = (heartrate);
			if(isNaN(ptimeloop) || ptimeloop < 0)
				ptimeloop = 0;
			clearTimeout(timer2);
		    timer2 = setTimeout(function() {heartbeat(ptimeloop); repeat();}, ptimeloop);
		};
	};

	function heartbeat(h2){
		//I'm really fascinated by velocity.js. Jquery seems inefficient when it comes to css animations, but opacity changing is pretty minor.
		//adding a bit on the heart rate pump out, makes it look a bit more realistic. I figure a heart collapsing take a bit more time then the heart pushing out blood
		var h3 = Math.round(h2 * 0.40);
		var h4 = Math.round((h2 * 0.60));
		//var h5 = Math.round((h2 * 0.34));
		$("#wrapper").velocity({ opacity: 0.3 }, { duration: h3 });
		$("#wrapper").velocity({ opacity: 1 }, { duration: h4 });
		//$("#wrapper").velocity({ opacity: 1 }, { duration: h5 });
		if(debug != 0){
			$("#heartrate").empty();
			$("#heartrate").append(
				moment.utc(item[i][0]).format("DD/MM/YYYY HH:mm:ss") + "<br>" +			//date
				item[i][1] + "<br>" +  		//heartrate
				//timeloop + "<br>" +    		// parent loop time
				//actualtimepassed + "<br>" + //last loop time past
				item[i][2]	+ "<br>" +		//loop wait time from json file
				h2 + "<br>" + 
				h3 + "<br>" + 				//pased in heart rate and time wait for pulse
				h4 //+ "<br>" + 		//time the starter starts
				//h5  			//time past on past loop
								
			);
		}
		gradientColor();
		$('#wrapper').css('background-color', heartcolor);
	}

	function gradientColor(){
		//I skewed blue between 0-65 as a gradient, then took the value and heightened it to red, because high heart beat is a warning. Used this website: http://www.perbang.dk/rgbgradient/
		//So I too 0bpm to 65 to be a gradient from dark blue to light blue, then light blue to red for the remainder. I figure healthy heart rate and based on the data, 60bpm is nice and blue which equals calm
		//I had to do it as a mapping because I couldn't do the math to figure out a skewed gradient
		if(bpm >= 100)
			heartcolor="#FF3A38";
		else if(bpm >= 95)
			heartcolor="#EF4852";
		else if(bpm >= 90)
			heartcolor="#DF566D";
		else if(bpm >= 85)
			heartcolor="#CF6488";
		else if(bpm >= 80)
			heartcolor="#BF73A2";
		else if(bpm >= 75)
			heartcolor="#AF81BD";
		else if(bpm >= 70)
			heartcolor="#9F8FD8";
		else if(bpm >= 65)
			heartcolor="#909EF3";
		else if(bpm >= 60)
			heartcolor="#8693EA";
		else if(bpm >= 55)
			heartcolor="#7C89E2";
		else if(bpm >= 50)
			heartcolor="#737FDA";
		else if(bpm >= 45)
			heartcolor="#6975D2";
		else if(bpm >= 40)
			heartcolor="#5F6BC9";
		else if(bpm >= 35)
			heartcolor="#5661C1";
		else if(bpm >= 30)
			heartcolor="#4C57B9";
		else if(bpm >= 0)
			heartcolor="#434DB1";

	}
	initiateDataRequest();
});


