
/**
 * Get the HTML elements of the chatroom
 */
const tradestable = document.getElementById('id_trades_table');

//TRADE CHECKER..
var MAX_CHECK_ATTEMPTS 	= 20;
var CHECK_TRADES 		= [];
var REFRESH_TRADES 		= false;

setInterval(function(){
	
	//Do we need a refresh
	if(REFRESH_TRADES){
		REFRESH_TRADES = false;
		
		//console.log("Refresh trades..");
				
		//Reset the table..
		setTradesTable();
		
		//Reset the ALL table..
		setAllTradesTable();
	}
	
	if(CHECK_TRADES.length==0){
		return;
	}
	
	console.log("Check all new trades..");
	
	//Check TRADES txpowid..
	var keeptrades = [];
	for(var i=0;i<CHECK_TRADES.length;i++){
		if(!CHECK_TRADES[i].checked && CHECK_TRADES[i].checkedamount<MAX_CHECK_ATTEMPTS){
			
			try{
				//Check if this is a valid trade
				checkTrade(CHECK_TRADES[i]);
				
				//Keeper	
				keeptrades.push(CHECK_TRADES[i]);	
			
			}catch(err){
				//Do not re-add this trade.. something wrong..
			}
		}
	}
	
	//Set new list
	CHECK_TRADES = keeptrades;
	
}, 1000 * 30);

function checkTrade(trade){
	//console.log("Checking new trade : "+JSON.stringify(trade));
	
	//Increment checked amount..
	trade.checkedamount++;
	
	//Check if this trade exists..
	MINIMASK.meg.checktxpow(trade.txpowid, function(resp){
		if(resp.status && resp.data.found){
			trade.checked=true;
			
			console.log("Valid trade found : "+JSON.stringify(resp));
			
			//Add the trade..
			ALL_TRADES.push(trade);
			
			//Order inverse
			ALL_TRADES.sort(sortTradesByTime);
			if(ALL_TRADES.length > MAX_TRADES_STORED){
				ALL_TRADES.pop();
			}
			
			//Refresh all trades..
			REFRESH_TRADES = true;
		}	
	});
}

/**
 * Initialise chat area
 */
function tradesInit(){
	
	wsAddListener(function(msg){
		//Is it a chat message
		if(msg.type=="trade"){
			console.log("New Trade : "+JSON.stringify(msg));
			
			//Get a sanitized trade
			var santrade 	 		= safeSanitize(msg.data);
			santrade.checked 		= false;
			santrade.checkedamount 	= 0;
			
			//Check is a valid trade..
			if(!santrade.txpowid.startsWith("0x00")){
				console.log("INVALID trade received : "+JSON.stringify(santrade));
				return;
			}
			
			//Add to our checker list
			CHECK_TRADES.push(santrade);
		}
	});	
	
	setTradesTable();
}

function setTradesTable(){
	
	//Update the price graph
	updatePriceChart();
	
	//Clear Table
	tradestable.innerHTML = "";
	
	//Set the Headers
	var row   = tradestable.insertRow(0);
	row.insertCell().outerHTML = "<th>Type</th>";
	row.insertCell().outerHTML = "<th>Amount</th>"; 
	row.insertCell().outerHTML = "<th>Price</th>";
	row.insertCell().outerHTML = "<th>Total</th>";
	row.insertCell().outerHTML = "<th style='width:0%;'>Date</th>";
	
	//Current time
	var ctime 		= getTimeMilli();
	var maxfindtime = ctime - HOURS_24;
			
	//Get all trades
	var firsttrade = true;
	
	var len = ALL_TRADES.length;
	if(len>MAX_TRADES_STORED){
		len = MAX_TRADES_STORED;
	}
	for(var i=0;i<len;i++) {
		
		try{
			var trade=ALL_TRADES[i];
			
			//Check is a valid trade..
			if(!trade.txpowid.startsWith("0x00")){
				continue;
			}
			
			if(!trade.checked){
				continue;
			}
					
			//Is it the right market
			if(trade.market.mktuid != CURRENT_MARKET.mktuid){
				continue;
			}
			
			//Is this the first trade..
			if(firsttrade){
				firsttrade = false;
				//setDexState("Last Price : "+trade.price);
			}
			
			//Insert row
			var row = tradestable.insertRow();
			row.style.fontSize = "0.8em";
			
			var celltype 	= row.insertCell();
			var cellamount 	= row.insertCell();
			var cellprice 	= row.insertCell();
			var celltotal 	= row.insertCell();
			var celldate 	= row.insertCell();
					
			//Set row color
			if(trade.type == "buy"){
				cellamount.className 	= "buyorder";
				cellprice.className 	= "buyorder";
				celltype.className 		= "buyorder";
				celltotal.className 	= "buyorder";
				celldate.className 		= "buyorder";	
			}else{
				cellamount.className 	= "sellorder";
				cellprice.className 	= "sellorder";
				celltype.className 		= "sellorder";
				celltotal.className 	= "sellorder";
				celldate.className 		= "sellorder";	
			}
			
			
			if(trade.date>maxfindtime){
				celltype.innerHTML 		= "&nbsp;<a target='history_txpowid' href='https://minimask.org/block/txpow.html?txpowid="+trade.txpowid+"'>"+trade.type.toUpperCase()+"</a>";
			}else{
				celltype.innerHTML 		= "&nbsp;"+trade.type.toUpperCase();
			}
			//celltype.innerHTML 		= "&nbsp;"+trade.type;
			//celltype.innerHTML 		= "&nbsp;<a target='history_txpowid' href='https://minimask.org/block/txpow.html?txpowid="+trade.txpowid+"'>"+trade.type.toUpperCase()+"</a>"; 
			
			cellamount.innerHTML 	= "&nbsp;"+trade.amount;
			cellprice.innerHTML 	= "&nbsp;"+trade.price;
			celltotal.innerHTML 	= "&nbsp;"+trade.total;
			celldate.innerHTML 		= "&nbsp;"+getTimeStr(trade.date)+"&nbsp;";	
			
		}catch(err){
			console.log("TRADE error : "+err);
		}
	}
}