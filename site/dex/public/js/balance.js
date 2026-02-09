var AUTO_BALANCE_INTERVALID 			= 0;
var AUTO_BALANCE_INTERVAL_COUNTER 		= 0;
var AUTO_BALANCE_INTERVAL_COUNTER_MAX 	= 20;
var AUTO_BALANCE_ENABLED 				= false;

/**
 * Fetch the balance for thisa User
 */
function fetchFullBalance(callback){
	
	//Are we splitting..
	var timenow = getTimeMilli();
	if(SPLIT_COIN_STOP_UPDATE + SPLIT_COIN_STOP_TIMEOUT > timenow){
		console.log("Fetch balance during split.. stopped..");
		
		//Don't update..! Splitting coins..
		if(callback){
			callback();
		}
		
		return;
	}
	
	//Check Balance..
	MINIMASK.meg.balancefull(USER_ACCOUNT.ADDRESS, 3, true, true, function(balresp){
		if(!balresp.status){
			console.log("Error retrieving balance : "+JSON.stringify(balresp));	
			return;
		}
		
		//The balance bit
		var balance = balresp.data;
		
		//The OLD balance..
		var oldbalance = JSON.stringify(USER_BALANCE);
		
		//Store for later
		USER_BALANCE = balance;
					
		//Check New vs Old
		if(JSON.stringify(balance) != oldbalance){
					
			if(oldbalance != "[]"){
				
				//Some thing has changed.. check for a few minutes..
				autoUpdateBalance();
				
				//Add a log..
				//addHistoryLog("BALANCE_CHANGE","User balance changes..", "");
			}
			
			//Update the server
			postMyOrdersToServer();
			
			//Update the Panel
			updateBalancePanel();
		}
		
		if(callback){
			callback();
		}
	});
}

/**
 * Auto check balance for a certain amount of time.. 
 */
function autoUpdateBalance(){
	
	//Disable the refresh button
	id_refreshbalance.disabled	= true;
	id_refreshbalance.innerHTML		= "Auto-Refresh (0 / "+AUTO_BALANCE_INTERVAL_COUNTER_MAX+")";
	
	//Hide the spli functions..
	AUTO_BALANCE_ENABLED 		= true;
	updateBalancePanel();
	
	//Clear the old
	clearInterval(AUTO_BALANCE_INTERVALID);
	
	//Reset counter
	AUTO_BALANCE_INTERVAL_COUNTER = 1;
	
	//Start a new one..
	AUTO_BALANCE_INTERVALID = setInterval(function(){
		//console.log("Auto-Balance checker Called!! "+AUTO_BALANCE_INTERVAL_COUNTER);	
		
		id_refreshbalance.innerHTML	= "Auto-Refresh ("+AUTO_BALANCE_INTERVAL_COUNTER+" / "+AUTO_BALANCE_INTERVAL_COUNTER_MAX+")";
		
		fetchFullBalance();
		
		//Do we stop!!
		AUTO_BALANCE_INTERVAL_COUNTER++;
		if(AUTO_BALANCE_INTERVAL_COUNTER > AUTO_BALANCE_INTERVAL_COUNTER_MAX){
			clearInterval(AUTO_BALANCE_INTERVALID);
			
			AUTO_BALANCE_ENABLED 		= false;
			
			id_refreshbalance.disabled	= false;
			id_refreshbalance.innerHTML	= "Auto-Refresh";
			
			updateBalancePanel();	
		}
		
	}, 10000);
}

/**
 * Get the balance for a specific token
 */
function getTokenBalance(tokenid, fullbalance){
	var len = fullbalance.length;
	for(var i=0;i<len;i++){
		var balance = fullbalance[i];
		if(balance.tokenid == tokenid){
			return balance;		
		}
	}
	
	return null;
}

/**
 * Check available balance for a tokenid
 */

function getConfirmedBalance(tokenid){
	
	//Cycle through the tokens..
	var len = USER_BALANCE.length;
	for(var i=0;i<len;i++){
		
		var balance = USER_BALANCE[i];
		if(balance.tokenid == tokenid){
		
			//Get the confirmed balane..
			return balance.confirmed;		
		}
	}
	
	return 0;
}

function getOrderBookBalance(tokenid){
	
	//Cycle through the orders..
	var total 	= 0;
	var len 	= USER_ORDERS.length;
	for(var i=0;i<len;i++){
		
		var order = USER_ORDERS[i];
		
		var amt 	= financial(order.amount);
		var price 	= financial(order.price);
		var tot 	= financial(amt * price);
		
		//Is it a BUY order
		if(order.type=="buy" && order.market.token2.tokenid == tokenid){
			total += tot;		
		}else if(order.type=="sell" && order.market.token1.tokenid == tokenid){
			total += amt;
		}
	}
	
	return financial(total);
}

function getAvailableBalance(tokenid){
	
	//First get the confirmed balance..
	var confirmed = financial(getConfirmedBalance(tokenid));
	
	//How much is in the orderbook
	var book = getOrderBookBalance(tokenid);
	
	//How much 
	var available = financial(confirmed - book);
	if(available<0){
		available = 0;
	}
	
	return available;
}

/**
 * When you split coins set amount to 0 until the confirmed balance changes..
 */
var SPLIT_COIN_STOP_UPDATE 	= 0;
var SPLIT_COIN_STOP_TIMEOUT = 60000;
function setSplitCoinsBalanceZero(tokenid){
	
	//Cycle through the tokens..
	var len = USER_BALANCE.length;
	for(var i=0;i<len;i++){
		
		var balance = USER_BALANCE[i];
		if(balance.tokenid == tokenid){
			balance.confirmed = 0;
			
			//Don;t update for 1 minute..
			SPLIT_COIN_STOP_UPDATE = getTimeMilli();
			
			//Update the server
			postMyOrdersToServer();
			
			//Update the Panel
			updateBalancePanel();
			
			return;		
		}
	}
}

function removeCoinsFromBalance(coinsremove){

	//How many coins..
	var coinremlen = coinsremove.length;
	
	//Cycle through the tokens..
	var len = USER_BALANCE.length;
	for(var i=0;i<len;i++){
		
		//Get this token balance..
		var balance = USER_BALANCE[i];
		
		//Get this tokens coinlist
		var coinlist 	= balance.coinlist; 
		var newcoinlist = [];
		
		//console.log("START Coins remove "+balance.tokenid+" "+balance.coinlist.length);
				
		//Do we remove it..
		var coinlen = coinlist.length;
		for(var j=0;j<coinlen;j++){
			var coin = coinlist[j];
			
			var found = false;
			for(var k=0;k<coinremlen;k++){
				var coinrem = coinsremove[k];
				
				//Do we keep it..
				if(coinrem == coin.coinid){
					//console.log("Coin Remove found : "+coinrem);
					
					found = true;
					break;
				}
			}
			
			//Did we find it..
			if(!found){
				newcoinlist.push(coin);
			}
		}
		
		//Reassign this list
		balance.coinlist = newcoinlist;
		//console.log("END Coins remove "+balance.tokenid+" "+balance.coinlist.length);
		
		//Now recalculate confirmed balance..
		var oldbal  = balance.confirmed;
		var coinlen = balance.coinlist.length;
		var tot = DECIMAL_ZERO;
		for(var j=0;j<coinlen;j++){
			if(balance.coinlist[j].tokenid == "0x00"){
				tot = tot.plus(new Decimal(balance.coinlist[j].amount));	
			}else{
				tot = tot.plus(new Decimal(balance.coinlist[j].tokenamount));
			}
		}
		balance.confirmed = tot.toString();
		//console.log("END Coins confirmed "+balance.tokenid+" "+tot+" / "+oldbal);
	}
	
	//Don't update for 1 minute..
	SPLIT_COIN_STOP_UPDATE = getTimeMilli();
	
	//Update the server
	postMyOrdersToServer();
	
	//Update the Panel
	updateBalancePanel();
}