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
	var startingLoopIndex = 0;


	


	function getdata(callback){
		//make sure all the json loads before starting processing, because get data is asynchrous. 
		$.getJSON('json/location.json', function(b) {
			$( b ).each(function( index ) {
				item[index] = [];
				item[index][0] = b[index].itemdate;
				item[index][1] = b[index].lat;
				item[index][2] = b[index].lng;
				item[index][3] = b[index].speedkph;
				item[index][4] = b[index].altitude;
				item[index][5] = b[index].accuracy;
				item[index][6] = b[index].locationtype;
				item[index][7] = b[index].distancekm;
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
				startingLoopIndex = j-1;
	    		break;
			}
			
		}
		//console.log(startingLoopIndex);
		//console.log(item[startingLoopIndex][0])
		//alert(itemdatetime);
	}
		
	function startloop(){
		function loop() {
			if( i <= startingLoopIndex){
				timeloop = 0;
				if(debug != 0){
					var daysfromJsonstart = diffJsonDate(item[0][0]);
					var nextitemdatetime = item[i+1][0];
					nextitemdatetime = moment.utc(nextitemdatetime).add(daysfromJsonstart, 'days');
					var now  = moment().format("DD/MM/YYYY HH:mm:ss");
					var then = moment.utc(nextitemdatetime).format("DD/MM/YYYY HH:mm:ss");
					nextloop = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
					nextloop = msToTime(nextloop);
				}
			}else{
				var daysfromJsonstart = diffJsonDate(item[0][0]);
				var nextitemdatetime = item[i][0];
				nextitemdatetime = moment.utc(nextitemdatetime).add(daysfromJsonstart, 'days');
				var now  = moment().format("DD/MM/YYYY HH:mm:ss");
				var then = moment.utc(nextitemdatetime).format("DD/MM/YYYY HH:mm:ss");
				timeloop = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
				if(debug != 0){
					nextloop = timeloop;
					nextloop = msToTime(nextloop);
					$("#itemdiv").append("<h1>" + nextloop + "</h1>");
				}
			}
			clearTimeout(timer1);
		    timer1 = setTimeout(function(){
	            runitemloop();
	            i++;
	            loop();
		    }, timeloop);
		}
		loop();
	}

	function runitemloop() {
		if(debug==0){
			$("#itemdiv").empty();
			$("body").html('<iframe id="google-map" width="100%" height="100%" frameborder="0" src="https://www.google.com/maps/embed/v1/view?key=AIzaSyDHcm1d3DWhoqTfJspst1Vr5SiUn8OODg4&center='+item[i][1]+','+item[i][2]+'&zoom=18&maptype=satellite" allowfullscreen> </iframe>');
		}else{
			$("#itemdiv").empty();
			$("#itemdiv").append(
				"<h1>" +
				moment.utc(item[i][0]).format("DD/MM/YYYY HH:mm:ss") + "<br>" +			// date
				item[i][1] + "<br>" +  		// itemvalue
				item[i][2] + "<br>" + 
				item[i][3] + "<br>" + 
				item[i][4] + "<br>" + 
				item[i][5] + "<br>" + 
				item[i][6] + "<br>" + 
				item[i][7] + "<br>" + 
				nextloop + "<br>" 
				+ "</h1>"
				
			)

		}
	};

	
	initiateDataRequest();
});


