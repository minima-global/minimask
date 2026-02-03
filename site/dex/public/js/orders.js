/**
 * Create an Order
 */
function createMyOrder(buysell, amount, price){
	var order 		= {};
	order.market 	= CURRENT_MARKET;
	order.type		= buysell;
	order.amount	= ""+amount;
	order.price		= ""+price;
	order.uuid		= getRandomHexString();
	return order;
}

/**
 * Add an order to your List
 */
function addMyOrderAndPost(order){
	
	//Now add this order to our list of prders
	USER_ORDERS.push(order);
	
	//Update all relevant
	updateMyOrders();
}

/**
 * Remove an order from Your OrderBook
 */
function checkCancelMyOrder(orderuuid){
	
	if(USER_SETTINGS.confirmOrders){
		if(confirm("Are you sure you wish to remove this order ? ")){
			removeMyOrderAndPost(orderuuid);	
		}
	}else{
		removeMyOrderAndPost(orderuuid);
	}
}

function removeMyOrderAndPost(uuid){
		
	var neworders = [];
	var len = USER_ORDERS.length;
	for(var i=0;i<len;i++) {
		if(USER_ORDERS[i].uuid != uuid){
			neworders.push(USER_ORDERS[i]);
		}
	}
	
	//Reset User Orders
	USER_ORDERS = neworders;
	
	//Update all relevant
	updateMyOrders();	
}

function getMyOrder(uuid){
	var len = USER_ORDERS.length;
	for(var i=0;i<len;i++) {
		if(USER_ORDERS[i].uuid == uuid){
			return USER_ORDERS[i];
		}
	}
	
	return null;
}

function findMyOrder(buysell, price){
	var len = USER_ORDERS.length;
	for(var i=0;i<len;i++) {
		if(USER_ORDERS[i].market.mktuid == CURRENT_MARKET.mktuid &&
		   USER_ORDERS[i].type  == buysell &&
		   +USER_ORDERS[i].price == +price){
			return USER_ORDERS[i];
		}
	}
	
	return null;
}


/**
 * We know the trade is valid.. update the book..
 */
function updateOrderAfterTrade(bookuid, tradecoins){
	
	var order = getMyOrder(bookuid);
	
	//The current order amount
	var decamt = new Decimal(order.amount);
	
	//Have I bought some..
	var tradeamt = DECIMAL_ZERO;
	
	//Buying or selling
	if(order.type=="buy"){
		tradeamt = tradecoins.outputtotal;
		
	}else if(order.type=="sell"){
		tradeamt = tradecoins.inputtotal;
	}
	
	//Whats left
	var newamt = decamt.minus(tradeamt);
	if(newamt.greaterThan(DECIMAL_ZERO)){
		order.amount = financialDecimal(newamt); 
		
		//Update all relevant
		updateMyOrders();
		
	}else{
		
		//remove order completely
		removeMyOrderAndPost(bookuid);
	}
}

function updateMyOrders(){
	
	//Store this locally..
	storeMyOrders();
		
	//Send updated book to server
	postMyOrdersToServer();
	
	//And set my orders table
	setMyOrdersTable();
	
	//Set ALL my orders table
	setAllMyOrders();
}

/**
 * Post your orders to the server
 */
function postMyOrdersToServer(){
	//Now send updated book to server
	var msg  = {};
	msg.type = "update_orderbook";
	
	//Create the OrderBook Details - includes your Balance!
	var myorderbook 	= {};
	myorderbook.address	= USER_ACCOUNT.ADDRESS;
	myorderbook.script 	= USER_ACCOUNT.SCRIPT;
	myorderbook.balance = USER_BALANCE;
	myorderbook.orders 	= USER_ORDERS;
	
	//Check is VALID
	if(!(myorderbook.address && myorderbook.script && myorderbook.balance && myorderbook.orders)){
		
		console.log("Error : You are creating an INVALID orderbook ? "+JSON.stringify(myorderbook));
		
		//Something went wrong.. ?
		return;
	}
	
	//Send this
	msg.data = myorderbook;
	
	wsPostToServer(msg);
}

/**
 * Store your Orders Locally
 */
function storeMyOrders(){
	//Store!
	STORAGE.setData("**USER_ORDERS_STORAGE**",USER_ORDERS);
}

function loadMyOrders(){
	
	//Load
	USER_ORDERS = STORAGE.getData("**USER_ORDERS_STORAGE**");
	
	//Check if exists
	if(USER_ORDERS == null){
		USER_ORDERS = [];
	}
}

/**
 * Search Orders
 */
function findValidOrder(mktuid, tokenid, buyorsell, price, amount){
	
	var list = [];
		
	//Cycle throuigh ALL_ORDERS users
	for(const key in ALL_ORDERS) {
		
		//Get this users complete book
		var compbook = ALL_ORDERS[key];
		
		try{
			//The script
			var script  = compbook.script;
			
			//The address
			var address  = compbook.address;
					
			//The balance - just for the token..
			var balance = getTokenBalance(tokenid,compbook.balance);
			
			//Get the order book
			var book = compbook.orders;
			for(var i=0;i<book.length;i++) {
				
				//Is it the right Market and right type..
				if(	book[i].market.mktuid == mktuid && 
					book[i].type == buyorsell &&
					+book[i].price == +price &&
					+book[i].amount >= +amount){
						
						//Found a possible..
						var possible 		= {};
						possible.userid		= key;
						possible.address 	= address;
						possible.script 	= script;
						possible.balance 	= balance;
						possible.book 		= book[i];
						
						//Add to our checking list
						list.push(possible);
				}
			}	
		}catch(Error){
			
		}
	}
	
	//Get a random one 
	return list;
}
	
