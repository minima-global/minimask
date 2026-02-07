
/**
 * Get the HTML elements of the chatroom
 */
const tradestable = document.getElementById('id_trades_table');

/**
 * Initialise chat area
 */
function tradesInit(){
	
	wsAddListener(function(msg){
		//Is it a chat message
		if(msg.type=="trade"){
			console.log("New Trade : "+JSON.stringify(msg));
			
			//Add the trade..
			ALL_TRADES.push(msg.data);
			
			//Order inverse
			ALL_TRADES.sort(sortTradesByTime);
						
			//Reset the table..
			setTradesTable();
			
			//Reset the ALL table..
			setAllTradesTable();
		}
	});	
	
	/*var testtrade = {"txpowid":"0x000086C5340B6AEA19334A1358551E265D8DAFC1F7DB408DD5F3EEF9B014D27E",
		"market":{"mktname":"aaa / Minima","mktuid":"0x375BA788DDD5F6631681FF9A276CAECC22CDF6458B9EA1D09CBAE6D3A9BA41EC / 0x00","token1":{"name":"aaa","tokenid":"0x375BA788DDD5F6631681FF9A276CAECC22CDF6458B9EA1D09CBAE6D3A9BA41EC"},"token2":{"name":"Minima","tokenid":"0x00"}},
		"price":"2","type":"sell",
		"amount":"0.0363","amounttoken":"0x375BA788DDD5F6631681FF9A276CAECC22CDF6458B9EA1D09CBAE6D3A9BA41EC",
		"total":"0.0726","totaltoken":"0x00", "date":0}

	ALL_TRADES.push(testtrade);
	*/
	
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
	setDexState("");
	
	var len = ALL_TRADES.length;
	for(var i=0;i<len;i++) {
		
		try{
			var trade=ALL_TRADES[i];
					
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
			
		}catch(Error){
			console.log("TRADE error : "+Error);
		}
	}
}