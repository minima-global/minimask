var WEB_SOCKET;
const MESSAGE_LISTENERS = [];

var LOGGING_ENABLED = false;

var ERROR_CONNECT_RECONNECT = false;
var RECONNECT_TIMER 		= 30000;

var AUTO_CLIENT_PINGID 		= 0;

const dex_state	= document.getElementById('id_dex_state');
function setDexState(str){
	dex_state.innerHTML = str;
}

function connectToServer(){
	//Connect to server
	wsInitSocket(function(){
		
		//Have connected to server - post your orders to it..
		postMyOrdersToServer();
	});
}

function wsInitSocket(initcallback){
	
	setDexState("Connecting..");
	
	//Clear the old
	clearInterval(AUTO_CLIENT_PINGID);
	
	//Try and connect
	WEB_SOCKET = new WebSocket(DEX_SERVER);
	
	WEB_SOCKET.onopen = () => {
	    console.log('Connected to server');
		setDexState("");
		ERROR_CONNECT_RECONNECT = false;
		
		//Start a new one..
		AUTO_CLIENT_PINGID = setInterval(function(){
			
			//Send a PING message
			pingMessage();
			
		}, 10000);
		
		if(initcallback){
			initcallback();
		}
	};

	WEB_SOCKET.onmessage = (event) => {
		if(LOGGING_ENABLED){
			console.log("WS : "+`Server: ${event.data}`);	
		}
				
		//What is the message
		var msg = JSON.parse(`${event.data}`);
		var len = MESSAGE_LISTENERS.length;
		for(var i=0;i<len;i++){
			MESSAGE_LISTENERS[i](msg);
		}
	};

	WEB_SOCKET.onclose = () => {
		
		//Are we already reconnecting..
		if(ERROR_CONNECT_RECONNECT){
			return;
		}
		
		setDexState("Diconnected.. reconnecting in 30s");
		console.log('Disconnected from server.. reconnect in 30 seconds..');
		
		//Reconnect attempt in 10 seconds..
		setTimeout(function(){connectToServer();}, RECONNECT_TIMER);
	};
	
	WEB_SOCKET.onerror = () => {
		setDexState("Error.. reconnecting in 30s");
		console.log('Error connecting to server');
		
		ERROR_CONNECT_RECONNECT = true;
		
		//Reconnect attempt in 10 seconds..
		setTimeout(function(){connectToServer();}, RECONNECT_TIMER);
	};
}

function wsAddListener(listener){
	MESSAGE_LISTENERS.push(listener);
}

function pingMessage(){
	var msg  	= {};
	msg.type	= "ping";
	msg.data	= {};
	
	wsPostToServer(msg);
}

function wsPostToServer(jsonmsg){
	
	var strmsg = JSON.stringify(jsonmsg);
	
	//Is the Socket OPEN
	if (WEB_SOCKET.readyState !== WebSocket.OPEN) {
		console.log("WS closed.. not sending message "+strmsg);
		return;
	}
	
	if(LOGGING_ENABLED){
		console.log("Post to server : "+strmsg);
	}
	
	WEB_SOCKET.send(strmsg);
}
