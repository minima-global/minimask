
/**
 * Get the HTML elements of the chatroom
 */
const alltradestable 	 = document.getElementById('id_alltrades_table');
const alltradesordertype = document.getElementById('id_alltrades_time');

var ALL_TRADES_ORDER_BY_MARKET = true;
function setAllTradesTable(){
	ALL_TRADES_ORDER_BY_MARKET = !alltradesordertype.checked; 
	if(ALL_TRADES_ORDER_BY_MARKET){
		setAllTradesTableMarket();
	}else{
		setAllTradesTableTime();
	}
}

function setAllTradesTableTime(){
	
	//Clear Table
	alltradestable.innerHTML = "";
	
	//Set the Headers
	var row   = alltradestable.insertRow(0);
	row.insertCell().outerHTML = "<th>Market</th>";
	row.insertCell().outerHTML = "<th>Type</th>";
	row.insertCell().outerHTML = "<th>Amount</th>"; 
	row.insertCell().outerHTML = "<th>Price</th>";
	row.insertCell().outerHTML = "<th>Total</th>";
	row.insertCell().outerHTML = "<th style='width:0%;'>Date</th>";
	
	//Current time
	var ctime 		= getTimeMilli();
	var maxfindtime = ctime - HOURS_24;
	
	//Max trades
	var len = ALL_TRADES.length;
	if(len>MAX_TRADES_STORED){
		len = MAX_TRADES_STORED;
	}
	
	for(var i=0;i<len;i++) {
		
		try{
			var trade=ALL_TRADES[i];
			
			//Insert row
			var row = alltradestable.insertRow();
			//row.style.fontSize = "0.9em";
			
			var cellmkt 	= row.insertCell();
			var celltype 	= row.insertCell();
			var cellamount 	= row.insertCell();
			var cellprice 	= row.insertCell();
			var celltotal 	= row.insertCell();
			var celldate 	= row.insertCell();
					
			//Set row color
			if(trade.type == "buy"){
				cellmkt.className 		= "buyorder";
				cellamount.className 	= "buyorder";
				cellprice.className 	= "buyorder";
				celltype.className 		= "buyorder";
				celltotal.className 	= "buyorder";
				celldate.className 		= "buyorder";	
			}else{
				cellmkt.className 		= "sellorder";
				cellamount.className 	= "sellorder";
				cellprice.className 	= "sellorder";
				celltype.className 		= "sellorder";
				celltotal.className 	= "sellorder";
				celldate.className 		= "sellorder";	
			}
			
			cellmkt.innerHTML 		= "&nbsp;"+trade.market.mktname;
			
			if(trade.date>maxfindtime){
				celltype.innerHTML 		= "&nbsp;<a target='history_txpowid' href='https://minimask.org/block/txpow.html?txpowid="+trade.txpowid+"'>"+trade.type.toUpperCase()+"</a>";
			}else{
				celltype.innerHTML 		= "&nbsp;"+trade.type.toUpperCase();
			}
			
			cellamount.innerHTML 	= "&nbsp;"+trade.amount;
			cellprice.innerHTML 	= "&nbsp;"+trade.price;
			celltotal.innerHTML 	= "&nbsp;"+trade.total;
			celldate.innerHTML 		= "&nbsp;"+getTimeStr(trade.date)+"&nbsp;";	
			
		}catch(err){
			console.log("TRADE error : "+err);
		}
	}
}

function setAllTradesTableMarket(){
	
	//Clear Table
	alltradestable.innerHTML = "";
	
	//Set the Headers
	var row   = alltradestable.insertRow(0);
	row.insertCell().outerHTML = "<th>Market</th>";
	row.insertCell().outerHTML = "<th>Type</th>";
	row.insertCell().outerHTML = "<th>Amount</th>"; 
	row.insertCell().outerHTML = "<th>Price</th>";
	row.insertCell().outerHTML = "<th>Total</th>";
	row.insertCell().outerHTML = "<th style='width:0%;'>Date</th>";
	
	//Current time
	var ctime 		= getTimeMilli();
	var maxfindtime = ctime - HOURS_24;
	
	//Max trades
	var len = ALL_TRADES.length;
	if(len>MAX_TRADES_STORED){
		len = MAX_TRADES_STORED;
	}
	
	if(len == 0){
		return;
	}
	
	//Get all the unique market..
	var uniquemarkets = [];
	for(var i=0;i<len;i++) {
		var trade	= ALL_TRADES[i];
		
		try{
			var market 	= trade.market.mktname;
			if(!uniquemarkets.includes(market)){
				uniquemarkets.push(market);
			}	
		}catch(err){
			
		}
	}
	
	//Sort..
	uniquemarkets.sort(function(a,b){
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	
	//Cycle through tht unique markets
	for(var mkt=0;mkt<uniquemarkets.length;mkt++){
	
		var currentmkt 	= uniquemarkets[mkt];
		var firstrun 	= true;
		
		for(var i=0;i<len;i++) {
			
			try{
				var trade=ALL_TRADES[i];
				
				if(firstrun){
					firstrun = false;
					
					var gaprow 		= alltradestable.insertRow();
					var gap 		= gaprow.insertCell();
					gap.innerHTML 	= "&nbsp;";
					
					var namerow 			= alltradestable.insertRow();
					var mktname 			= namerow.insertCell();
					mktname.colSpan 		= "4";
					mktname.style.fontSize 	= "0.9em";
					mktname.style.color 	= "grey";
								
					mktname.innerHTML 		= "&nbsp;"+currentmkt;
				}
				
				//Is this a new Market
				if(trade.market.mktname != currentmkt){
					continue;
				}
				
				//Insert row
				var row = alltradestable.insertRow();
				//row.style.fontSize = "0.9em";
				
				var cellmkt 	= row.insertCell();
				var celltype 	= row.insertCell();
				var cellamount 	= row.insertCell();
				var cellprice 	= row.insertCell();
				var celltotal 	= row.insertCell();
				var celldate 	= row.insertCell();
						
				//Set row color
				if(trade.type == "buy"){
					cellmkt.className 		= "buyorder";
					cellamount.className 	= "buyorder";
					cellprice.className 	= "buyorder";
					celltype.className 		= "buyorder";
					celltotal.className 	= "buyorder";
					celldate.className 		= "buyorder";	
				}else{
					cellmkt.className 		= "sellorder";
					cellamount.className 	= "sellorder";
					cellprice.className 	= "sellorder";
					celltype.className 		= "sellorder";
					celltotal.className 	= "sellorder";
					celldate.className 		= "sellorder";	
				}
				
				cellmkt.innerHTML 		= "&nbsp;"+trade.market.mktname;
				
				if(trade.date>maxfindtime){
					celltype.innerHTML 		= "&nbsp;<a target='history_txpowid' href='https://minimask.org/block/txpow.html?txpowid="+trade.txpowid+"'>"+trade.type.toUpperCase()+"</a>";
				}else{
					celltype.innerHTML 		= "&nbsp;"+trade.type.toUpperCase();
				}
				
				cellamount.innerHTML 	= "&nbsp;"+trade.amount;
				cellprice.innerHTML 	= "&nbsp;"+trade.price;
				celltotal.innerHTML 	= "&nbsp;"+trade.total;
				celldate.innerHTML 		= "&nbsp;"+getTimeStr(trade.date)+"&nbsp;";	
				
			}catch(err){
				console.log("TRADE error : "+err);
			}
		}
	}
}