
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
			
			//Tells us who we are
			USER_UUID = msg.uuid;
			
			//Get all the Trades
			ALL_TRADES = msg.data.trades;
			
			//Order inverse
			ALL_TRADES.sort(sortTradesByTime);
				
			//Store this..
			ALL_ORDERS = msg.data.orderbooks;
			
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
			}catch(Error){
				console.log("Message REC error : "+Error);
			}
			
		}else if(msg.type=="pong"){
			//console.log("Received PONG : ");
						
		}else if(msg.type=="closed"){
			//console.log("UUID CLOSED : "+JSON.stringify(msg));
			
			//Remove this user from All orders..
			delete ALL_ORDERS[msg.uuid];
			
			//Update the markets 
			updateAllMarkets();
						
			//Set the table
			setAllOrdersTable();
		}
	});
}


function postStartupDex(){
	
	//Load User Settings
	loadUserSettings();
	
	//Init each Panel
	chatroomInit();
	allordersInit();
	
	initCreateOrder();
	
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
	});
	
	//Listen for messages..
	mainListenerLoop();
						
	//Now connect to server
	connectToServer();
}

function loadUserDetails(){
	return STORAGE.getData("**USER_DETAILS**");
}

function saveUserDetails(){
	STORAGE.setData("**USER_DETAILS**", USER_ACCOUNT);
}
