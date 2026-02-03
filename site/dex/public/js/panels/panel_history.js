
const history_table = document.getElementById('id_history_table');

/**
 * Show all the history
 */
function showHistory(){
	//Clear Table
	history_table.innerHTML = "";
	
	//Set the Headers
	var row   = history_table.insertRow(0);
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Time</th>";
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Action</th>"; 
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Details</th>";
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Extra</th>";
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Check</th>";
	
	//Get my Orders
	var len = USER_HISTORY.length;
	for(var i=0;i<len;i++) {
		
		var history=USER_HISTORY[i];
		
		//Insert row
		var row = history_table.insertRow();
		
		var celltime 		= row.insertCell();
		var cellaction 		= row.insertCell();
		var celldetails 	= row.insertCell();
		if(history.details.toLowerCase().startsWith("buy")){
			celldetails.className = "buyorder";
		}else if(history.details.toLowerCase().startsWith("sell")){
			celldetails.className = "sellorder";
		}else{
			celldetails.className = "otherorder";
		}
		
		var cellextra 		= row.insertCell();
		var cellcheck 		= row.insertCell();
				
		var dateString 		= getTimeStr(history.time);
		
		celltime.innerHTML 		= "&nbsp;"+dateString
		cellaction.innerHTML 	= "&nbsp;"+history.action;
		
		if(history.details.length > 80){
			celldetails.innerHTML 	= "&nbsp;"+history.details.substring(0,80)+"..";
		}else{
			celldetails.innerHTML 	= "&nbsp;"+history.details;	
		}
		
		if(history.extra.startsWith("0x")){
			cellextra.innerHTML 		= "&nbsp;<a target='history_txpowid' href='https://minimask.org/block/txpow.html?txpowid="+history.extra+"'>"+history.extra+"</a>";	
			cellextra.style.fontSize 	= "0.7em";
			
			//Put a check button..
			cellcheck.innerHTML 	= "&nbsp;<button class=mybtn style='font-size:10px;padding: 4px 6px' onclick='checkTxPow(\""+history.extra+"\");'>Check</button>";
			
		}else{
			cellextra.innerHTML 	= "&nbsp;"+history.extra;	
		}
	}	
}

function checkTxPow(txpowid){
	showTradeInfoPanel();
	
	addTextTradeInfo("Checking status of TxPoW..");
	
	MINIMASK.meg.checktxpow(txpowid, function(resp){
		addTextTradeInfo( JSON.stringify(resp.data, null, 2));	
	});
}

