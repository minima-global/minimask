/**
 * Imports
 */
import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import fs from 'fs';

import * as RATE_LIMIT from "./serverlibs/ratelimit.js"
import * as UTILS from "./serverlibs/serverutils.js"


/**
 * Defauilt parameters
 */
var DEBUG_LOGS 			= false;
var DEBUG_SHORT			= false;
var SERVER_PORT 		= 8081;
var MAX_TRADES 			= 1000;
var MAX_USER_ORDERS 	= 50;

var TRADES_FILE 		= "./trades.json";
var RATELIMIT_FILE 		= "./ratelimit.json";

var MEG_CHECK_TRADES	= false;
var MEG_SERVER 			= "127.0.0.1";
var MEG_PORT 			= 8080;
var MEG_USERPASS 		= "apicaller:apicaller";

/**
 * Command line params..
 */
const args = process.argv;
for(var c=0;c<args.length;c++){
	var param = args[c];
	
	if(param == "-help"){
		
		console.log("Usage parameters : ");
		console.log("-port [port]                            : Set the port to listen on");
		console.log("-megserver [user:password@host:port]    : Specify a MEG server to check trades");
		console.log("-tradesfile [file]                      : Set the file to store trades");
		console.log("-ratesfile [file]                       : Set the file to store rate limit data");
		console.log("-maxtrades [maxtrades]                  : Max trades to store in file");
		console.log("-debug                                  : Show debug output");
		console.log("-debugshort                             : Show shorter debug output");
		console.log("-help                                   : Show this help");
		
		//And exit
		process.exit();	
	
	}else if(param == "-debug"){
		DEBUG_LOGS = true;
	
	}else if(param == "-debugshort"){
		DEBUG_LOGS  = true;
		DEBUG_SHORT = true;
				
	}else if(param == "-tradesfile"){
		c++;
		TRADES_FILE = args[c];
	
	}else if(param == "-ratesfile"){
		c++;
		RATELIMIT_FILE = args[c];
		
	}else if(param == "-maxtrades"){
		c++;
		MAX_TRADES = +args[c];
	
	}else if(param == "-megserver"){
		c++;
		
		var megserver = args[c];
		
		//Break it down into the components
		var at = megserver.indexOf("@");
		MEG_USERPASS = megserver.substring(0,at);
		
		var hostport = megserver.substring(at+1);
		at = hostport.indexOf(":");
		
		MEG_SERVER 	= hostport.substring(0,at);
		MEG_PORT 	= +hostport.substring(at+1);
		
		MEG_CHECK_TRADES = true; 
		
		if(DEBUG_LOGS){
			console.log("MEG_USER    : "+MEG_USERPASS);
			console.log("MEG_SERVER  : "+MEG_SERVER);
			console.log("MEG_PORT    : "+MEG_PORT);
		}
			
	}else if(param == "-port"){
		c++;
		SERVER_PORT = +args[c];
	}
}

//Output some info
console.log('DEX server is running on port '+SERVER_PORT);
console.log('Trades are stored in file '+TRADES_FILE);
console.log('MAX Trades to store '+MAX_TRADES);
if(DEBUG_LOGS){
	console.log('DEBUG logs are ON');
}else{
	console.log('DEBUG logs are OFF');
}

//Create a WebSocket Server
const server = new WebSocketServer({ 
    port: SERVER_PORT 
});

//The set of all clients
const clients 	= new Set();

//All the Client orderbooks
var orderbooks 	= {};

//All the Trades
var alltrades	= [];

//Last few Chat messages..
var allchat	= [];

//Run a function on exit
process.on("SIGINT", function(){
	process.exit(0);
});

process.on("SIGTERM", function(){
	process.exit(0);
});

process.on("exit", function(){
	shutdown();
});

function shutdown(){
	
	console.log("Running shutdown function..");
	
	
	//Try and write this..
	try{
		console.log("Save trades file..");
		fs.writeFileSync(TRADES_FILE, JSON.stringify(alltrades));
			
		console.log("Save rate limit data..");
		RATE_LIMIT.saveRateLimitData(RATELIMIT_FILE);
			
	}catch(Error){
		console.log("Error writing files.. : "+Error)
	}
	
	
}

//What to do on connections
server.on('connection', (socket) => {
	
	//Set a unique ID
	socket.id = UTILS.getRandomHexString();
	if(DEBUG_LOGS){
		console.log("New Connection.. "+socket.id);	
	}	
	
	//We still have to receive the FIRST message
	socket.firstmessage = false;
		
	//Add client to our list
	clients.add(socket);
	
	//Create an init message
	var init 		= {};
	init.trades 	= alltrades;
	init.orderbooks = orderbooks;
	init.chat 		= allchat;
	
	//Tell the user their uuid and the current orderbooks
	socket.send(createCustomMsg(socket.id,"init_dex",init));
	
	//On receive message
    socket.on('message', (message) => {
		
		try{
			
			//Get the message
			var strmsg 	= `${message}`;
			
			//Get the JSON version
			var msgjson = JSON.parse(strmsg);
			
			//Get the UUID
			var uuid = msgjson.uuid;
			if(!uuid){
				//Incorrect message format
				console.log("MISSING UUID from:"+socket.id);
				return;
			}
			
			//Blank uuid.. as not to share
			msgjson.uuid = "0xFF";
			
			if(DEBUG_LOGS){
				if(msgjson.type != "ping"){
					if(DEBUG_SHORT){
						console.log("Message from:"+socket.id+" msg:"+strmsg.substring(0,20)+"..");	
					}else{
						console.log("Message from:"+socket.id+" msg:"+strmsg);	
					}	
				} 
			}
			
			//Check if the User is in the SIN BIN (ping allowed)
			if(msgjson.type != "ping"){
				
				//Check for User
				if(!RATE_LIMIT.checkForUser(uuid)){
					console.log("Add new UUID user : "+uuid);
					
					//Add this User to the Rate Limiter
					RATE_LIMIT.addRLUser(uuid);
					
					//NEW users automatically go in SIN BIN..
					sinbin(uuid, socket, "As a NEW USER you are not allowed to send messages for 5 minutes..");
					
					socket.firstmessage = true;
					
					return;
					
				}else if(RATE_LIMIT.checkSinBin(uuid)){
					console.log("SINBIN Message ignored from:"+socket.id+" msg:"+msgjson.type);
					
					//Is this the FIRST message
					if(!socket.firstmessage){
						socket.firstmessage = true;
						
						console.log("Send sinbin message to User "+uuid);
						
						//Tell the user to refresh in 10 minutes..
						var rateobj 	= {};
						rateobj.uuid	= "0x000000";
						rateobj.message = "YOU HAVE EXCEEDED THE MESSAGE RATE LIMIT! (..you are in the SIN BIN for 5 minutes)";
						
						//Send them a message..
						socket.send(createCustomMsg("0x00","ratelimit",rateobj));
					}
					
					return;
				
				}else if(!RATE_LIMIT.newValidRLMessage(uuid)){
									
					//EXCEEDED..! add to SIN BIN	
					sinbin(uuid, socket, "YOU HAVE EXCEEDED THE MESSAGE RATE LIMIT! (..added to SIN BIN for 5 minutes)");
					
					try{
						//wipe their orders.. they refresh in 10 minutes
						var sinorderbook 	= orderbooks[socket.id];
						sinorderbook.orders = [];
						
						//Broadcast this new empty book..
						broadcast(createCustomMsg(socket.id,"update_orderbook",sinorderbook));	
						
					}catch(err){
						
					}
					
					return;
				}	
			}
			
			//We have now received the first message
			socket.firstmessage = true;
			
			//What message type is it..
			if(msgjson.type == "chat"){
				
				if(msgjson.data.trim() != ""){
					
					//Broadcast to all..
					newChat(socket.id, msgjson);	
				}
				
			}else if(msgjson.type=="update_orderbook"){
				
				//Get the orderbook
				var orderbook = msgjson.data;
				
				//Check is a valid book
				if(!checkOrderBookMessage(orderbook)){
					console.log("Invalid orderbook received.. "+JSON.stringify(orderbook));
					
					var err 		= {};
					err.type 		= "INVALID_ORDER";
					err.message 	= "You have sent an invalid orderbook! MAX ("+MAX_USER_ORDERS+")";
					
					//Send them a message.. 
					socket.send(createCustomMsg("0x00","error","You have sent an invalid orderbook! MAX ("+MAX_USER_ORDERS+")"));
					
					return;
				}
				
				//Add to our total list
				orderbooks[socket.id] = orderbook;
				
				//Broadcast this..
				broadcast(createCustomMsg(socket.id,"update_orderbook",orderbook)); 	
			
			}else if(msgjson.type=="update_addorder"){
							
				//Remove this order - so server has correct book for User
				addOrder(socket.id, msgjson.data);
				
				//Broadcast this..
				broadcast(createCustomMsg(socket.id,"update_addorder",msgjson.data));	
					
			}else if(msgjson.type=="update_removeorder"){
				
				//Remove this order - so server has correct book for User
				removeOrder(socket.id, msgjson.data);
				
				//Broadcast this..
				broadcast(createCustomMsg(socket.id,"update_removeorder",msgjson.data));	
					
			}else if(msgjson.type=="refresh"){
				
				//Create an init message
				var init 		= {};
				init.trades 	= alltrades;
				init.orderbooks = orderbooks;
				init.chat 		= allchat;
				
				//Tell the user their uuid and the current orderbooks
				socket.send(createCustomMsg(socket.id,"init_dex",init));
				
			}else if(msgjson.type=="message"){
				
				//Get the User..
				sendToUser(socket.id, msgjson.data.uuid, msgjson.data.message);
				
			}else if(msgjson.type=="trade"){
				
				//There has been a trade
				var trade = msgjson.data;
								
				//NOT checked yet
				trade.checkuid  = UTILS.getRandomHexString();
				trade.checked   = false;
				trade.checking  = MEG_CHECK_TRADES;
				
				if(MEG_CHECK_TRADES){
					//Add to our check list
					addCheckTrade(trade);	
				
				}else{
					//Add it to our list
					addTrade(trade);
				}
				
				//Broadcast
				broadcast(createCustomMsg("0x00","trade",trade));
									
			}else if(msgjson.type=="ping"){
				
				//Send back a pong message
				socket.send(createCustomMsg("0x00","pong",{}));		
				
			}else{
				console.log("Unknown message type :"+msgjson.type+" msg:"+strmsg);
			}
				
		}catch(Error){
			console.log("Error onmessage from:"+socket.id+" error:"+Error);
		}
    });

	//On Close connection
    socket.on('close', () => {
		if(DEBUG_LOGS){
			console.log(`Connection Closed: `+socket.id);
		}
		
		try{
			//remove from our client list
			clients.delete(socket);
			
			//Delete the orderbook
			delete orderbooks[socket.id];
			
			//Tell all the clients..
			broadcast(createCustomMsg(socket.id,"closed",""));
				
		}catch(Error){
			console.log("Error onclose from:"+socket.id+" error:"+Error);
		}
		
    });
});

//Read in the trades..
try {
  	// Read file synchronously
  	const data = fs.readFileSync(TRADES_FILE, 'utf8');
  
  	//Convert
  	alltrades 		= JSON.parse(data);
	var tradelen 	= alltrades.length;
	
	console.log("Trades found : "+tradelen);
	
	//Check size..
	if(tradelen > MAX_TRADES){
		console.log("Trimming Trades to MAX : "+MAX_TRADES);
		
		var starttrade = tradelen-MAX_TRADES; 
		var newarr = [];
		for(var i=0;i<MAX_TRADES;i++){
			var trade = alltrades[starttrade + i];
			newarr.push(trade); 
		}

		//Set this..
		alltrades = newarr; 
	}
  
} catch (err) {
  	//File not found.. first time running..
	console.error('No Trades found.. yet..');
}

//Load in the Rate limit..
RATE_LIMIT.loadRateLimitData(RATELIMIT_FILE);

/**
 * UTILITY FUNCTIONS
 */

//Broadcast a message
function broadcast(str){
	
	if(DEBUG_LOGS){
		if(DEBUG_SHORT){
			console.log("Broadcast > "+str.substring(0,20)+"..");
		}else{
			console.log("Broadcast > "+str);
		}	
	}
	
	//Cycle through all the clients
	clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			try{
			    client.send(str);	
			}catch(Error){
				console.log("Error send to:"+client.id+" error:"+Error);
			}
		}
    });
}

//Broadcast a message
function sendToUser(from, to, data){
	
	//Create the message
	var msg = createCustomMsg(from, "message", data);
	
	if(DEBUG_LOGS){
		if(DEBUG_SHORT){
			console.log("Send To "+to+"> "+msg.substring(0,20)+"..");
		}else{
			console.log("Send To "+to+"> "+msg);	
		}
	}
	
	//Cycle through all the clients
	var found = false;
	clients.forEach((client) => {
		if (!found && client.id==to && client.readyState === WebSocket.OPEN) {
			try{
			    client.send(msg);
				found = true;	
			}catch(Error){
				console.log("Error send to:"+client.id+" error:"+Error);
			}
		}
    });
	
	if(!found){
		console.log("Error user not found:"+id);	
	}
}

/**
 * RATE LIMIT SIN BIN
 */
function sinbin(uuid, socket, message){
	
	//Add User to the Sin bin.. 
	RATE_LIMIT.addUserSinBin(uuid);
	
	//Tell the user to refresh in 10 minutes..
	var rateobj 	= {};
	rateobj.uuid	= "0x000000";
	rateobj.message = message;
	
	//Send them a message..
	socket.send(createCustomMsg("0x00","ratelimit",rateobj));
}

/**
 * Add a trade = only keep the last X many
 */
function addTrade(trade){
	
	//Push to our list..
	alltrades.push(trade);
	
	//Max number of trades
	if(alltrades.length > MAX_TRADES){
		alltrades.shift();
	}	
}

/**
 * Add a Chat message
 */
function newChat(fromuuid, msg){
	
	//No blank messages
	if(msg.data.trim() == ""){
		return;
	}else if(msg.data.length > 256){
		//Too long..
		return;	
	}
	
	//Create a Chat object
	var chatobj 	= {};
	chatobj.uuid	= fromuuid;
	chatobj.message = msg.data.trim();
	
	//Push to our list..
	allchat.push(chatobj);
	
	//Max number of trades
	if(allchat.length > 500){
		allchat.shift();
	}
	
	//Broadcast to all..
	broadcast(createCustomMsg(fromuuid,"chat",chatobj));	
}

//Create any message
function createCustomMsg(id, type, data){
	var msg 	= {};
	msg.uuid	= id;
	msg.type	= type;
	msg.data	= data;
	
	return JSON.stringify(msg);
}

//Check the Update_orderBook message
function checkOrderBookMessage(orderbook){
	
	//Check is a valid book
	if(!(	orderbook.address && 
			orderbook.script && 
			orderbook.balance && 
			orderbook.orders)){
		//Bad Orderbook
		return false;
	}
	
	//How many orders
	if(orderbook.orders.length >= MAX_USER_ORDERS){
		return false;
	}
	
	return true;
	
}

//Add an order to a Users Orderbook
function addOrder(fromid, order){
	//Get that Orderbook
	var book = orderbooks[fromid].orders;
	
	book.push(order);
}

//Remove an order from a User
function removeOrder(fromid, bookuuid){
	
	//Get that Orderbook
	var book = orderbooks[fromid].orders;
	
	//Now remove that order
	var neworders = [];
	var len = book.length;
	for(var i=0;i<len;i++) {
		if(book[i].uuid != bookuuid){
			neworders.push(book[i]);
		}
	}
	
	//Reset User Orders
	orderbooks[fromid].orders = neworders;
}


/**
 * IF a MEG server is spoecified.. will check a Trade before sending on..
 */
var MEG_AUTH 			= 'Basic ' + Buffer.from(MEG_USERPASS).toString('base64');;
var MAX_CHECK_ATTEMPTS 	= 20;
var CHECK_TRADES 		= [];
	
if(MEG_CHECK_TRADES){
	
	setInterval(function(){
		
		//Any trades to check
		if(CHECK_TRADES.length==0){
			return;
		}
		
		if(DEBUG_LOGS){
			console.log("Check all new trades..");	
		}
		
		//Check TRADES txpowid..
		var keeptrades = [];
		for(var i=0;i<CHECK_TRADES.length;i++){
			
			if(!CHECK_TRADES[i].checked){
				if(CHECK_TRADES[i].checkedamount<MAX_CHECK_ATTEMPTS){
							
					try{
						//Check if this is a valid trade
						checkTrade(CHECK_TRADES[i]);
						
						//Keeper	
						keeptrades.push(CHECK_TRADES[i]);	
					
					}catch(err){
						console.log("Error checking trade : "+JSON.stringify(CHECK_TRADES[i])+" "+err);
					}
				}
			}
		}
		
		//Set new list
		CHECK_TRADES = keeptrades;
		
	}, 1000 * 30);
	
	//Run a check
	UTILS.postURL(MEG_SERVER, MEG_PORT, MEG_AUTH, "/wallet/block","",function(resp){
		console.log("MEG check block call : "+JSON.stringify(resp));
	});
}

function addCheckTrade(trade){
	
	if(DEBUG_LOGS){
		console.log("Check trade added : "+JSON.stringify(trade));	
	}
	
	//Trade not checked..
	trade.checked		= false;
	trade.checkedamount	= 0;
	
	//Check it..
	CHECK_TRADES.push(trade);
}

function checkTrade(trade){
		
	//Increment checked amount..
	trade.checkedamount++;
	
	//Check if this trade exists..
	checkTxPoW(trade.txpowid, function(resp){
		console.log("CHECK : "+JSON.stringify(resp));
		
		if(resp.status && resp.response.found){
			trade.checked=true;
			
			if(DEBUG_LOGS){
				console.log("Valid trade found : "+JSON.stringify(resp));
			}
			
			//Add it to our list
			addTrade(trade);
			
			//Broadcast
			broadcast(createCustomMsg("0x00","trade_check",trade));
		}	
	});
}

function checkTxPoW(txpowid,callback){
	UTILS.postURL(MEG_SERVER, MEG_PORT, MEG_AUTH, "/wallet/checktxpow","txpowid="+txpowid, function(resp){
		callback(resp);	
	});
}
