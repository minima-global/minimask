
/**
 * Get the HTML elements of the chatroom
 */
const allorderstable = document.getElementById('id_allorders_table');

/**
 * Initialise chat area
 */
function allordersInit(){
	
	wsAddListener(function(msg){
		
		try{
					
			if(msg.type=="update_orderbook"){
				
				//Set this..
				ALL_ORDERS[msg.uuid] = msg.data;
			
			}else if(msg.type=="update_addorder"){
				
				//Get that Orderbook
				var book = ALL_ORDERS[msg.uuid].orders;
				
				//Push the new order
				book.push(msg.data);
				
			}else if(msg.type=="update_removeorder"){
					
				//Get that Orderbook
				var book 		= ALL_ORDERS[msg.uuid].orders;
				var bookuuid 	= msg.data;
				
				//Now remove that order
				var neworders = [];
				var len = book.length;
				for(var i=0;i<len;i++) {
					if(book[i].uuid != bookuuid){
						neworders.push(book[i]);
					}
				}
				
				//Reset User Orders
				ALL_ORDERS[msg.uuid].orders = neworders;
			}
			
			//And reset..
			updateAllMarkets();
						
			//Set the table
			setAllOrdersTable();
			
		}catch(err){
			console.log("ERROR All_Orders "+JSON.stringify(msg)+" "+err);
		}
	});	
}

function getOrdersOnly(buysell){
	
	var list = [];
	
	//Cycle throuigh ALL_ORDERS users
	for(const key in ALL_ORDERS) {
		
		//Try and add..
		try{
			//Get the order book
			var book = ALL_ORDERS[key].orders;
			
			//Cycle through the book
			var len = book.length;
			for(var i=0;i<len;i++) {
				
				//Is it the right Market and right type..
				if(book[i].market.mktuid == CURRENT_MARKET.mktuid && book[i].type==buysell){
					list.push(book[i]);
				}
			}	
		}catch(err){
			console.log("Could not add user OrderBook to all orders : "+err);
		}	
	}
	
	return list;
}

function buyAction(price, maxamount){
	showMktActionPanel(true, price, maxamount);	
}

function sellAction(price, maxamount){
	showMktActionPanel(false, price, maxamount);
}

function addTotalOrdersRows(data){
	
	var len = data.length;
	for(var i=0;i<len;i++) {
		var order=data[i];
		
		//Insert row
		var row = allorderstable.insertRow();
		row.style.fontSize = "0.8em";
		
		var cellorders 		= row.insertCell();
		var celltotal 		= row.insertCell();
		var cellmaxamount 	= row.insertCell();
		var cellprice 		= row.insertCell();
		var cellaction 		= row.insertCell();
		
		cellorders.innerHTML 		= "&nbsp;"+order.orders;
		celltotal.innerHTML 		= "&nbsp;"+order.total;
		cellmaxamount.innerHTML 	= "&nbsp;"+order.maxamount;
		cellprice.innerHTML 		= "&nbsp;"+order.price;
		
		//Set row color
		if(order.type == "buy"){
			cellorders.className 			= "buyorder";
			celltotal.className 			= "buyorder";
			cellmaxamount.className 		= "buyorder";
			cellprice.className 			= "buyorder";
			
			cellaction.innerHTML 	= "<button class='mybtn' onclick='sellAction(\""+order.price+"\", \""+order.maxamount+"\");'>SELL</button>";
		}else{
			cellorders.className 			= "sellorder";
			celltotal.className 			= "sellorder";
			cellmaxamount.className 		= "sellorder";
			cellprice.className 			= "sellorder";
			
			cellaction.innerHTML 	= "<button class='mybtn' onclick='buyAction(\""+order.price+"\", \""+order.maxamount+"\");'>BUY</button>";	
		}
	}
}

function squashListTotals(data){
	
	var list 	= [];
	var len 	= data.length;
	if(len == 0){
		return list;
	}
	
	var oldorder 	= data[0];
	var total 		= DECIMAL_ZERO;
	var cmax 		= DECIMAL_ZERO;
	var orders		= 0;
	
	for(var i=0;i<len;i++) {
		var order=data[i];
		
		var decamount = new Decimal(order.amount);
		
		//Is it the same price.. 
		if(order.price == oldorder.price){
			total = total.plus(decamount);
			
			if(decamount.greaterThan(cmax)){
				cmax = decamount;
			}
			
			orders++;
			
		}else{
			
			//Add the old..
			var newrow 			= {};
			newrow.total 		= decimalRDown(total);
			newrow.maxamount	= decimalRDown(cmax);
			newrow.price		= oldorder.price;
			newrow.type			= oldorder.type; 
			newrow.orders 		= orders;
			
			list.push(newrow);
			
			//And reset
			total 	= decamount;
			cmax  	= decamount;
			orders 	= 1;
		}
		
		oldorder = order;
	}
	
	//Push the last order
	var newrow 			= {};
	newrow.total 		= decimalRDown(total);
	newrow.maxamount	= decimalRDown(cmax);
	newrow.price		= oldorder.price; 
	newrow.type			= oldorder.type;
	newrow.orders 		= orders;
	
	list.push(newrow);
	
	return list;
}

function setAllOrdersTable(){
	
	//Clear Table
	allorderstable.innerHTML = "";
	
	//Set the Headers
	var row   = allorderstable.insertRow(0);
	row.insertCell(0).outerHTML = "<th class='smalltableheadertext'>Orders</th>";
	row.insertCell(1).outerHTML = "<th class='smalltableheadertext'>Total Amount</th>";
	row.insertCell(2).outerHTML = "<th class='smalltableheadertext'>Max Amount</th>";
	row.insertCell(3).outerHTML = "<th class='smalltableheadertext'>Price</th>";
	row.insertCell(4).outerHTML = "<th  class='smalltableheadertext' style='width:0%;'>Action</th>"; 
	
	//FIRST the SELL orders..
	var sells=getOrdersOnly("sell");
	
	//Now order by price.. descending
	sells.sort(compareDesc);
	
	//Squash to totals..
	var sqsells=squashListTotals(sells);
	
	//Add this totals list
	addTotalOrdersRows(sqsells);
	
	//Add a gap row..
	var gaprow 			= allorderstable.insertRow();
	var gapcell 		= gaprow.insertCell();
	gapcell.colSpan 	= 5
	gapcell.style.textAlign = "center";
	gapcell.innerHTML	="- - - - - - - - -";
	
	//Now the BUY orders
	var buys=getOrdersOnly("buy");
	
	//Now order by price.. descending
	buys.sort(compareDesc);
	
	//Squash to totals..
	var sqbuys = squashListTotals(buys);
	
	//Add this totals list
	addTotalOrdersRows(sqbuys);
}