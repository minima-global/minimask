import { WebSocketServer } from 'ws';

import fs from 'fs';

//TEST STUFF
//import * as clientjs from "./client.cjs";
//console.log("Random:"+clientjs.getRandomHexString()+" "+clientjs.tester());

//Are we logging..
var DEBUG_LOGS 	= false;
var SERVER_PORT = 8081;

//How many trades to keep in history log
var MAX_TRADES 	= 10000;

//What file are the trades storeed in
var TRADES_FILE = "/home/spartacusrex/dextrades.json";

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

//What to do on connections
server.on('connection', (socket) => {
	
	//Set a unique ID
	socket.id = getRandomHexString();
	if(DEBUG_LOGS){
		console.log("New Connection.. "+socket.id);	
	}	
		
	//Add client to our list
	clients.add(socket);
	
	//Create an init message
	var init 		= {};
	init.trades 	= alltrades;
	init.orderbooks = orderbooks;
	
	//Tell the user their uuid and the current orderbooks
	socket.send(createCustomMsg(socket.id,"init_dex",init));
	
	//On receive message
    socket.on('message', (message) => {
		
		try{
			
			//Get the message
			var strmsg 	= `${message}`;
			if(DEBUG_LOGS){
				console.log("Message from:"+socket.id+" msg:"+strmsg);	
			}
			
			//Get the JSON version
			var msgjson = JSON.parse(strmsg);
			
			//What message type is it..
			if(msgjson.type == "chat"){
				
				if(msgjson.data.trim() != ""){
					
					//Broadcast to all..
					broadcast(createCustomMsg(socket.id,"chat",msgjson.data));	
				}
				
			}else if(msgjson.type=="update_orderbook"){
				
				//Get the orderbook
				var orderbook = msgjson.data;
				
				//Add to our total list
				orderbooks[socket.id] = orderbook;
				
				//Broadcast this..
				broadcast(createCustomMsg(socket.id,"update_orderbook",orderbook)); 	
			
			}else if(msgjson.type=="refresh"){
				
				//Send the whole orderbook
				socket.send(createCustomMsg("0x00","orderbooks",orderbooks));
			
			}else if(msgjson.type=="message"){
				
				//Get the User..
				sendToUser(socket.id, msgjson.data.uuid, msgjson.data.message);
				
			}else if(msgjson.type=="trade"){
				
				//There has been a trade
				var trade = msgjson.data;
				
				//Add it to our list
				addTrade(trade);
				
				//Broadcast
				broadcast(createCustomMsg("0x00","trade",trade));	
				
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

console.log('DEX server is running on ws://localhost:'+SERVER_PORT);

//Read in the trades..
try {
  	// Read file synchronously
  	const data = fs.readFileSync(TRADES_FILE, 'utf8');
  
  	//Convert
  	alltrades = JSON.parse(data);
  
  	if(DEBUG_LOGS){
		console.log('Trades Loaded : ', data);
	}
  
} catch (err) {
  	//File not found.. first time running..
	console.error('No Trades found.. yet..');
}

/**
 * UTILITY FUNCTIONS
 */

//Broadcast a message
function broadcast(str){
	
	if(DEBUG_LOGS){
		console.log("Broadcast > "+str);	
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
	var msg 	= createCustomMsg(from, "message", data);
	
	if(DEBUG_LOGS){
		console.log("Send To "+to+"> "+msg);	
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
 * Add a trade = only keep the last X many
 */
function addTrade(trade){
	
	//Push to our list..
	alltrades.push(trade);
	
	//Max number of trades
	if(alltrades.length > MAX_TRADES){
		alltrades.shift();
	}

	//Try and write this..
	try{
		fs.writeFileSync(TRADES_FILE, JSON.stringify(alltrades));	
	}catch(Error){
		console.log("Error write file.. : "+Error)
	}	
}

//Create any message
function createCustomMsg(id, type, data){
	var msg 	= {};
	msg.uuid	= id;
	msg.type	= type;
	msg.data	= data;
	
	return JSON.stringify(msg);
}

//Get a random string
const HEXVALS = '0123456789ABCDEF';
function getRandomHexString() {
    let output = '';
    for (let i = 0; i < 30; ++i) {
        output += HEXVALS.charAt(Math.floor(Math.random() * HEXVALS.length));
    }
    return "0x"+output;
}