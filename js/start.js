var startdate = new Date('08/03/2016');
var startoverdays = 30;
var debug = getParameterByName('debug');
if(debug == null)
	debug = 0;
else
	debug = 1;



function diffStartDatetoToday(){
	var now  = moment().format("DD/MM/YYYY");
	var then = moment(startdate).format("DD/MM/YYYY");
	var days = moment(now, "DD/MM/YYYY").diff(moment(then, "DD/MM/YYYY"), 'days');
	return days;	
}

function diffJsonDate(myvar){
	now = moment(startdate).format("DD/MM/YYYY");
	then  = moment.utc(myvar).format("DD/MM/YYYY");
	days = moment(now, "DD/MM/YYYY").diff(moment(then, "DD/MM/YYYY"), 'days');
	return days;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

// For todays date;
Date.prototype.dateNow = function () { 
    return  this.getFullYear() +"-"+ (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ ((this.getDate() < 10)?"0":"") + this.getDate();
}
//2016-07-15T00:00:00
// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function addDays(date, days) {
    var result = new Date(date);
    console.log(result);
    result.setDate(result.getDate() + days);
    return result;
}

function doTimer(length, resolution, oninstance, oncomplete)
{
	var steps = (length / 100) * (resolution / 10),
        speed = length / steps,
        count = 0,
        start = new Date().getTime();

    function instance()
    {
        if(count++ == steps)
        {
            oncomplete(steps, count);
        }
        else
        {
            oninstance(steps, count);

            var diff = (new Date().getTime() - start) - (count * speed);
            //alert(diff);
            window.setTimeout(instance, (speed - diff));
        }
    }

    window.setTimeout(instance, speed);
}

//global timeout references we can use to stop them
var timeouts = {};


//timer demo function with normal/self-adjusting argument
function timer(form, adjust, morework)
{
	//create the timer speed, a counter and a starting timestamp
	var speed = 50,
	counter = 0, 
	start = new Date().getTime();
	
	//timer instance function
	function instance()
	{
		//if the morework flag is true
		//do some calculations to create more work
		if(morework)
		{
			for(var x=1, i=0; i<1000000; i++) { x *= (i + 1); }
		}
		
		//work out the real and ideal elapsed time
		var real = (counter * speed),
		ideal = (new Date().getTime() - start);
		
		//increment the counter
		counter++;
			
		//display the values
		form.ideal.value = real;
		form.real.value = ideal;

		//calculate and display the difference
		var diff = (ideal - real);
		form.diff.value = diff;

		//if the adjust flag is true
		//delete the difference from the speed of the next instance
		if(adjust)
		{
			timeouts[form.id] = window.setTimeout(function() { instance(); }, (speed - diff));
		}
		
		//otherwise keep the speed normal
		else
		{
			timeouts[form.id] = window.setTimeout(function() { instance(); }, speed);
		}
	};
	
	//now kick everything off with the first timer instance
	timeouts[form.id] = window.setTimeout(function() { instance(); }, speed);
}


	
	

/*
var startdate = new Date('08/01/2016');
var startoverdays = 30;

// For todays date;
Date.prototype.dateNow = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

// For the time now
getTimefrom = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function getDiffDays(){

	var today = new Date().dateNow();
	var timeDiff = Math.abs(today.getTime() - startdate.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	if(diffDays > startoverdays){
		startDate = today;
		diffDays = 0;
	}
	return diffDays-1;
}
*/

