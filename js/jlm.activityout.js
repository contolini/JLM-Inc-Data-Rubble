$(document).ready(function() {

	var itemrate=0;
	var bpm=0;
	var timeloop=0;
	var nextloop = 0;
	//itemTime[0] = 50;
	var item = [];
	// main count
	var i = 0;
	var j = 0;
	var k = 0;
	var e = 0;
	var h3 = 0; 
	
	var timer1 = 0;
	var timer2 = 0 
	var jsonRecordCount=0;
	var startingLoopIndex = 0;


	


	function getdata(callback){
		//make sure all the json loads before starting processing, because get data is asynchrous. 
		$.getJSON('json/activityout.json', function(b) {
			$( b ).each(function( index ) {
				item[index] = [];
				item[index][0] = b[index].itemdate;
				item[index][1] = b[index].itemvalue;
			});
			callback('hey');
		});
	}

	function initiateDataRequest(){
	    //get our JSON, make sure all the json loads before starting processing, because get data is asynchrous and you can't start calling items until they all load
	    //I kept getting errors on loading the json, so I'm going to keep trying till I get no errors. This is a total copout.
	    getdata(function(data){
	    	
		    		getStartingLoopIndex();
					i = startingLoopIndex;
			        startloop();
			     
	    });
	}

	function getStartingLoopIndex(){
		var daysfromstart = diffStartDatetoToday();
		var daysfromJsonstart = diffJsonDate(item[0][0]);
		for (j = 0; j < item.length; j++) { 
			var itemdatetime = moment.utc(moment.utc(item[j][0]).add(daysfromJsonstart, 'days'));
			//alert(itemdatetime);
			now  = moment().format("DD/MM/YYYY HH:mm:ss");
			then = moment(itemdatetime).format("DD/MM/YYYY HH:mm:ss");
			days = moment(now, "DD/MM/YYYY").diff(moment(then, "DD/MM/YYYY"), 'days');
			var itemdiff = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
			//alert(itemdiff);
			if(itemdiff == 0){
				startingLoopIndex = j;
	    		break;
			}else if(itemdiff > 0){
				if(j==0)
					startingLoopIndex = j;
				else
					startingLoopIndex = j-1;
	    		break;
			}
			
		}
		//console.log(startingLoopIndex);
		//console.log(item[startingLoopIndex][0])
		//alert(itemdatetime);
	}
		
	function startloop() { 
		
		//this is the loop that starts everything off. it first starts with changing the bpm and then calls the funtion to change the pulsing and background color
		function loop() {
			if( i == startingLoopIndex){
				timeloop = 0;
				var daysfromJsonstart = diffJsonDate(item[0][0]);
				var nextitemdatetime = item[i+1][0];
				nextitemdatetime = moment.utc(nextitemdatetime).add(daysfromJsonstart, 'days');
				var now  = moment().format("DD/MM/YYYY HH:mm:ss");
				var then = moment.utc(nextitemdatetime).format("DD/MM/YYYY HH:mm:ss");
				var nextloop = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
				
				//console.log(nextloop);
			}
			else{
				var daysfromJsonstart = diffJsonDate(item[0][0]);
				var nextitemdatetime = item[i+1][0];
				nextitemdatetime = moment.utc(nextitemdatetime).add(daysfromJsonstart, 'days');
				var now  = moment().format("DD/MM/YYYY HH:mm:ss");
				var then = moment.utc(nextitemdatetime).format("DD/MM/YYYY HH:mm:ss");
				var timeloop = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
				//console.log(timeloop);
			}
			clearTimeout(timer1);
			
	    	timer1 = setTimeout(function() {
	            runitemloop();
	            i++;
	            loop();
		    }, timeloop);
		}
		loop();
		
	}

	function runitemloop() {
		if(debug==0){
			$('body').css('background-image', "url(images/activityout/" + encodeURIComponent(item[i][1]) + ")");
		}else{
			console.log(i);
			console.log(item[i][1]);
			$("#itemdiv").empty();
			//Screen%20Shot%202016-06-28%20at%2010.33.09%20PM.png
			//Screen%20Shot%202016-06-28%20at%2010.33.09%20PM.png
			$('body').css('background-image', "url(images/activityout/" + encodeURIComponent(item[i][1]) + ")");
			$("#itemdiv").append(
				"<h1>" +
				moment.utc(item[i][0]).format("DD/MM/YYYY HH:mm:ss") + "<br>" +			// date
				item[i][1] + "<br>" +  		// itemvalue
				timeloop + "<br>" +  
				nextloop
				+ "</h1>"
				
			)

		}
	};

	
	initiateDataRequest();
});

