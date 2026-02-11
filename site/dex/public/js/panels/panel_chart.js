
//Get the canvas..
var CHART_CANVAS = document.getElementById('chartgraph');
CHART_CANVAS.style.width	='100%';
CHART_CANVAS.style.height	='100%';
CHART_CANVAS.width  		= CHART_CANVAS.offsetWidth;
CHART_CANVAS.height 		= CHART_CANVAS.offsetHeight;

var CHART_CONTEXT = CHART_CANVAS.getContext('2d');

var CHART;

var CHART_BARS 		= 40;
var CURRENT_BARDATA = [];

//How much time to show
var CHART_TIME_10MINUTES	= 1000 * 60 * 10;
var CHART_TIME_30MINUTES	= 1000 * 60 * 30;
var CHART_TIME_HOUR 		= CHART_TIME_10MINUTES * 6;
var CHART_TIME_DAY 			= CHART_TIME_HOUR * 24;
var CHART_TIME_WEEK 		= CHART_TIME_DAY * 7;

var CHART_TIMESPAN 			= CHART_TIME_10MINUTES;

/**
 * Update the price chart given the current trades and market
 */
function initPriceChart(){
		
	//What is the current Market
	CHART = new Chart(CHART_CONTEXT, {
	  type: 'candlestick',
	  data: {
	    datasets: [{
	      label: "Price Chart",
	      data: CURRENT_BARDATA,
	    }]
	  }
	}); 
}

function setPriceChartTimeSpan(spantime){
	if(spantime == "WEEK"){
		CHART_TIMESPAN = CHART_TIME_WEEK; 
	}else if(spantime == "DAY"){
		CHART_TIMESPAN = CHART_TIME_DAY; 
	}else if(spantime == "HOUR"){
		CHART_TIMESPAN = CHART_TIME_HOUR; 
	}else if(spantime == "30MINUTES"){
		CHART_TIMESPAN = CHART_TIME_30MINUTES; 
	}else if(spantime == "10MINUTES"){
		CHART_TIMESPAN = CHART_TIME_10MINUTES; 
	} 
	
	updatePriceChart();
}

function setPriceData(){
	
	//Set the title
	if(CHART_TIMESPAN == CHART_TIME_WEEK){
		CHART.config.data.datasets[0].label = CURRENT_MARKET.mktname+" (1 Week)";
	}else if(CHART_TIMESPAN == CHART_TIME_DAY){
		CHART.config.data.datasets[0].label = CURRENT_MARKET.mktname+" (1 Day)";	
	}else if(CHART_TIMESPAN == CHART_TIME_HOUR){
		CHART.config.data.datasets[0].label = CURRENT_MARKET.mktname+" (1 Hour)";	
	}else if(CHART_TIMESPAN == CHART_TIME_30MINUTES){
		CHART.config.data.datasets[0].label = CURRENT_MARKET.mktname+" (30 Minutes)";	
	}else if(CHART_TIMESPAN == CHART_TIME_10MINUTES){
		CHART.config.data.datasets[0].label = CURRENT_MARKET.mktname+" (10 Minutes)";	
	}
	
	//Curent time
	var timenow = getTimeMilli();
	var mintime = timenow - CHART_TIMESPAN;
	
	//First get all the trades for the current market in the current timespan
	var ctrades = [];
	var len = ALL_TRADES.length;
	for(var i=0;i<len;i++) {
		var trade=ALL_TRADES[i];
		if(trade.market.mktuid == CURRENT_MARKET.mktuid && trade.date>=mintime){
			ctrades.push(trade);
		}
	}
	var ctradelen 	= ctrades.length;
	
	//Find the FIRST open
	var firstopen 	  = DECIMAL_ZERO;
	var firstopentime = new Decimal(timenow + (CHART_TIME_WEEK*2))
	
	for(var j=0;j<ctradelen;j++){
		var ctrade = ctrades[j];
	
		var price 		= new Decimal(ctrade.price);
		var pricedate   = new Decimal(ctrade.date);
		
		if(pricedate.lessThan(firstopentime)){
			firstopentime 	= pricedate; 
			firstopen 		= price;
		} 
	}
	
	//Now create the candles
	var candletime 	= CHART_TIMESPAN / CHART_BARS;
			
	var current_close = firstopen;
	for(var i=0;i<CHART_BARS;i++){
		
		//Start and end time of the candle
		var starttime 	= timenow - CHART_TIMESPAN + (candletime * i);
		var endtime 	= starttime + candletime; 
		 
		//The open is the latest close..
		var open 		= current_close;
		
		var close 		= current_close;
		var closetime 	= 0;
		
		var high 		= 0;
		var low 		= 1000000000;
		
		//Cycle through valuid trades..
		for(var j=0;j<ctradelen;j++){
			var ctrade = ctrades[j];
			
			//Is this trade in the window.. ?
			if(ctrade.date>=starttime && ctrade.date<=endtime){
				
				//Add to totals..
				if(ctrade.date > closetime){
					close 			= ctrade.price;
					closetime 		= ctrade.date;
					current_close 	= close;  
				}
				
				if(ctrade.price > high){
					high = ctrade.price;
				}
				
				if(ctrade.price < low){
					low = ctrade.price;
				}
			}			
		}
		
		//Did we find any..
		if(low == 1000000000){
			low 	= current_close;
			high 	= current_close;
			open 	= current_close;
			close 	= current_close;
		}
		
		//Create the candle
		var cc = createCandle(starttime, open, high, low, close);
		CURRENT_BARDATA[i] = cc;	
	}
}

function updatePriceChart() {
	
	//Set the chart data
	setPriceData();
	
	//Update the chart
  	CHART.update();
};


function createCandle(timemilli, open, high, low, close){
	var candle 	= {};
	candle.time	= getTimeStr(timemilli);
	candle.x 	= timemilli;
	candle.o	= open;
	candle.h	= high;
	candle.l	= low;
	candle.c	= close;
	
	return candle;
}