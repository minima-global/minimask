
/**
 * Message handling
 */

var MINIMASK_LOGGING = false;

var MINIMASK_REQUESTS = [];

function windowReceiveMessage(evt) {
	
	//What was the message
	var msg = event.data;
	
	if(!msg){
		return;
	}else if(msg.minitype != "MINIMASK_RESPONSE"){
		return;
	}
	
	if(MINIMASK_LOGGING){
		console.log("MiniMask Response : "+JSON.stringify(evt.data));	
	}
	
	//Get the randid..
	var randid 	= msg.randid;
	
	//Now cycle..
	var len 	= MINIMASK_REQUESTS.length;
	var found 	= false;
	for(var i=0;i<len;i++){
		var datauri = MINIMASK_REQUESTS[i];
		if(datauri.randid == randid){
			found 	= true;
			
			//Call back..
			if(datauri.callback){
				datauri.callback(msg.data);
			}
		}
	}
	
	if(!found){
		MDS.log("MinWEB Request not found : "+JSON.stringify(msg));
	}
	
	//Now remove that elemnt
	MINIMASK_REQUESTS = MINIMASK_REQUESTS.filter(function(item) {
	    return item.randid !== randid;
	});
	
}
window.top.addEventListener("message", windowReceiveMessage, false);


function postMessageToServiceWorker(action, callback){
	
	//Create a JSON message to capture the reply
	var request 		= {};
	request.randid		= Math.floor(Math.random() * 1000000000); 
	request.callback 	= callback;
	
	//Push to our stack of requests
	MINIMASK_REQUESTS.push(request);
	
	//Make a postable message
	var msg 		= {};
	msg.minitype	= "MINIMASK_REQUEST";
	msg.randid		= request.randid;
	msg.action 		= action;
	
	//Send this to the top window.. origin /
	window.top.postMessage(msg);
}


/**
 * Main MinimMask Object for all interaction
 */
var MINIMASK = {
			
	/**
	 * MINIMASK Startup
	 */
	init : function(callback){
		
		//Log a little..
		console.log("Initialising MiniMask..");
		
		//Is logging enabled.. via the URL
		if(callback){
			callback();	
		}
	},
	
	
	/**
	 * Call the MEG functions
	 */
	create : function(callback){
			
		var msg  		= {};
		msg.function 	= "create";
		
		//Run a function..
		postMessageToServiceWorker(msg, function(resp){
			callback(resp);
		});	
	},
	
	block : function(callback){
		
		var msg  		= {};
		msg.function 	= "block";
		
		//Run a function..
		postMessageToServiceWorker(msg, function(resp){
			callback(resp);
		});	
	}
}

