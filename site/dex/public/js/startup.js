
const user_dex_state	= document.getElementById('id_user_dex_state');
function setUserDexState(str){
	user_dex_state.innerHTML = str;
}

const trade_dex_state	= document.getElementById('id_trade_dex_state');
function setTradeDexState(str){
	trade_dex_state.innerHTML = str;
}

document.getElementById('id_init_password').addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        init_passwordcheck();	
    }
});

/**
 * Called to  init DEX
 */
function initDEX(){
	
	//Wait for page to load - CHECK MINIMASK
	window.onload = function () {
		
		//Have we loaded the MiniMask Extension
		if(typeof MINIMASK !== "undefined"){
			
			//Lets see if we are logged in..
			MINIMASK.init(function(initmsg){
				
				//Log all messages
				console.log("MINIMASK init : "+JSON.stringify(initmsg,null,2));
				
				if(initmsg.event == "MINIMASK_INIT"){
					
					//Load the User Details..
					showInitPanel();
					
				}else if(initmsg.event == "MINIMASK_PENDING"){
					//Confirmed Pending actions will be sent here..
					
				}	
			});
			
		}else{
			console.log("MINIMASK extension not active!");	
			alert("MiniMask Extension Not Active!\n\nThis applicatgion requires MiniMask");
		}	
	}
}

function mainListenerLoop(){
	
	//Add yourself to thew conversation
	wsAddListener(function(msg){
		
		//First start up message
		if(msg.type=="init_dex"){
			
			console.log("Init message received..");
			
			//Tells us who we are
			USER_UUID = msg.uuid;
			
			//Get all the Trades - and sanitize
			ALL_TRADES = safeSanitize(msg.data.trades);
			
			//Order inverse
			ALL_TRADES.sort(sortTradesByTime);
			
			//All server trades are supposed checked..
			for(var i=0;i<ALL_TRADES.length;i++){
				ALL_TRADES[i].checked = true;
			}
				
			//Store this..
			ALL_ORDERS = safeSanitize(msg.data.orderbooks);
						
			refreshAllOrders();
			
			//And set the chat
			dexChatHistory(msg.data.chat);
			
		}else if(msg.type=="message"){
			
			try{
				var recmsg = msg.data;
				if(recmsg.type=="trade_request"){
					
					//Check this Txn..!
					checkAndSignTrade(msg.uuid, recmsg.data);
						
				}else if(recmsg.type=="trade_complete"){
					
					//Just finished a trade
					tradeComplete(recmsg.data);	
				}	
			}catch(err){
				console.log("Message REC error : "+err);
			}
			
		}else if(msg.type=="pong"){
			//console.log("Received PONG : ");
		
		}else if(msg.type=="orderbooks"){
			
			//Complete orderbooks..!
			ALL_ORDERS = safeSanitize(msg.data);
			
			refreshAllOrders();
									
		}else if(msg.type=="closed"){
			//console.log("UUID CLOSED : "+JSON.stringify(msg));
			
			//Remove this user from All orders..
			delete ALL_ORDERS[msg.uuid];
			
			//Update the markets 
			updateAllMarkets();
						
			//Set the table
			setAllOrdersTable();
		
		}else if(msg.type=="error"){
			console.log("SERVER ERROR : "+JSON.stringify(msg.data));	
		}
	});
}

function refreshAllOrders(){
	//Update the markets 
	updateAllMarkets();
				
	//Set the Table
	setAllOrdersTable();
	
	//Set My Orders - need the markets setup..
	setMyOrdersTable();
	
	//Set ALL my orders table
	setAllMyOrders();

	//Set the trades table..
	setTradesTable();
	
	//Set the ALL trades table
	setAllTradesTable();
}

function postStartupDex(){
	
	//Load User Settings
	loadUserSettings();
	initSettings();
	
	//Init each Panel
	chatroomInit();
	allordersInit();
	
	//Wallet
	walletInit();
	
	//Load your Orders
	loadMyOrders();
	
	//Init History
	initHistory();
	
	initPriceChart();
	
	//Init trade panel
	tradesInit();
	
	fetchFullBalance(function(){
		navigate_dex();
		//navigate_alltrades();	
	});
	
	//Listen for messages..
	mainListenerLoop();
						
	//Now connect to server
	connectToServer();
	
	//Refresh the local data completely every 30 mins..
	setInterval(function(){
		
		console.log("Refresh ALL data!");
		
		refreshAllData();
		
	}, 60000 * 30);
}

function loadUserDetails(){
	return STORAGE.getData("**USER_DETAILS**");
}

function saveUserDetails(){
	STORAGE.setData("**USER_DETAILS**", USER_ACCOUNT);
}

function setTotalUsersConnected(){
	//setUserDexState("Connected Users : "+Object.keys(ALL_ORDERS).length);
	
	//Count the Orders
	var totorders=0;
	for(const key in ALL_ORDERS) {
			
		//Try and add..
		try{
			//Get the order book
			var book = ALL_ORDERS[key].orders;
			
			//Cycle through the book
			var len 	= book.length;
			totorders  += len;
			
		}catch(err){
			//console.log("Could not add user OrderBook to all orders : "+Error);
		}	
	}
	setTradeDexState("Users : "+Object.keys(ALL_ORDERS).length
					+" / Markets : "+ALL_MARKETS.length
					+" / Orders : "+totorders);
}

/**
 * Refresh all data
 */
function refreshAllData(){
	//Post an add message
	var msg  = {};
	msg.type = "refresh";
	msg.data = "";
	
	//Post to server
	wsPostToServer(msg);
}

