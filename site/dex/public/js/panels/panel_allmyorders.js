
const allmyorders_table = document.getElementById('id_allmyorders_table');

function setAllMyOrders(){
	
	//Clear Table
	allmyorders_table.innerHTML = "";
	
	//Set the Headers
	var row   = allmyorders_table.insertRow(0);
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Amount</th>";
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Price</th>"; 
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Type</th>";
	row.insertCell().outerHTML = "<th class='smalltableheadertext' style='width:0%;'>Action</th>";
	
	var old_mkt = "";	
	
	//Sort them..
	USER_ORDERS.sort(sortUserOrdersAlphabetically);
	
	//Get my Orders
	var len = USER_ORDERS.length;
	for(var i=0;i<len;i++) {
		
		var order=USER_ORDERS[i];
		
		//Which mkt is this..
		var mkt = order.market.mktname;
		if(mkt != old_mkt){
			
			//Add a row..
			var mktrow 					= allmyorders_table.insertRow();
			var mktrowdata 				= mktrow.insertCell();
			mktrowdata.colSpan 			= "4";
			mktrowdata.style.fontSize 	= "0.7em";
			mktrowdata.style.color 		= "grey";
			mktrowdata.innerHTML 		= "<br>"+mkt;
			
			old_mkt = mkt;
		} 
		
		//Insert row
		var row = allmyorders_table.insertRow();
		
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
		
		cellamount.innerHTML 	= "&nbsp;"+DOMPurify.sanitize(order.amount);
		cellprice.innerHTML 	= "&nbsp;"+DOMPurify.sanitize(order.price);
		celltype.innerHTML 		= "&nbsp;"+DOMPurify.sanitize(order.type); 
		cellaction.innerHTML 	= "<button class='mybtn' onclick='checkCancelMyOrder(\""+DOMPurify.sanitize(order.uuid)+"\")'>Cancel</button>";
	}	
}