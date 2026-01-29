
/**
 * Get the HTML elements of the chatroom
 */
const myorderstable = document.getElementById('id_myorders_table');


function setMyOrdersTable(){
	
	//Clear Table
	myorderstable.innerHTML = "";
	
	//Set the Headers
	var row   = myorderstable.insertRow(0);
	row.insertCell(0).outerHTML = "<th class='smalltableheadertext'>Amount</th>";
	row.insertCell(1).outerHTML = "<th class='smalltableheadertext'>Price</th>"; 
	row.insertCell(2).outerHTML = "<th class='smalltableheadertext'>Type</th>";
	row.insertCell(3).outerHTML = "<th class='smalltableheadertext' style='width:0%;'>Action</th>";
		
	//Get my Orders
	var len = USER_ORDERS.length;
	for(var i=0;i<len;i++) {
		
		var order=USER_ORDERS[i];
		
		//Is it in the current mkt..
		if(order.market.mktuid != CURRENT_MARKET.mktuid){
			continue;
		}
		
		//Insert row
		var row = myorderstable.insertRow();
		row.style.fontSize = "0.8em";
		
		var cellamount 	= row.insertCell();
		var cellprice 	= row.insertCell();
		var celltype 	= row.insertCell();
		var cellaction 	= row.insertCell();
		
		//Set row color
		if(order.type == "buy"){
			cellamount.className 	= "buyorder";
			cellprice.className 	= "buyorder";
			celltype.className 		= "buyorder";
			
		}else{
			cellamount.className 	= "sellorder";
			cellprice.className 	= "sellorder";
			celltype.className 		= "sellorder";	
		}
		
		cellamount.innerHTML 	= "&nbsp;"+order.amount;
		cellprice.innerHTML 	= "&nbsp;"+order.price;
		celltype.innerHTML 		= "&nbsp;"+order.type; 
		cellaction.innerHTML 	= "<button class='mybtn' onclick='removeMyOrderAndPost(\""+order.uuid+"\")'>Cancel</button>";
	}
}