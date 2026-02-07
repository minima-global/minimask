
/**
 * Get the HTML elements of the chatroom
 */
const alltradestable = document.getElementById('id_alltrades_table');

function setAllTradesTable(){
	
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
	
	//Max 250 trades
	var len = ALL_TRADES.length;
	if(len>500){
		len = 500;
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
			celltype.innerHTML 		= "&nbsp;"+trade.type.toUpperCase();
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