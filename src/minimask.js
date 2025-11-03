


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
		
		//Get Init details
		postMessageToServiceWorker(_createSimpleMessage("minimask_extension_init"), function(resp){
			if(callback){
				callback(resp);	
			}
		});
	},
	
	/**
	 * Access the MiniMask account
	 */
	account : {
		
		balance : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_balance"), function(resp){
				callback(resp);
			});
		},
		
		getAddress : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_getaddress"), function(resp){
				callback(resp);
			});
		},
		
		getPublicKey : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_getpublickey"), function(resp){
				callback(resp);
			});
		},
		
		send : function(amount, address, tokenid, callback){
			var msg = _createSimpleMessage("account_send");
			
			msg.params.amount  = ""+amount;
			msg.params.address = address;
			msg.params.tokenid = tokenid;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		}
		
	},
	
	/**
	 * Call the MEG functions directly
	 */
	meg : {
		
		create : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("create"), function(resp){
				callback(resp);
			});	
		},
		
		balance : function(address, callback){
			var msg = _createSimpleMessage("balance");
			msg.params.address  = address;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		},
		
		send : function(amount, toaddress, tokenid, fromaddress, privatekey, script, keyuses, callback){
			var msg = _createSimpleMessage("send");
			
			msg.params.amount  		= amount;
			msg.params.toaddress  	= toaddress;
			msg.params.tokenid  	= tokenid;
			msg.params.fromaddress  = fromaddress;
			msg.params.privatekey  	= privatekey;
			msg.params.script  		= script;
			msg.params.keyuses  	= keyuses;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});	
		},
		
		block : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("block"), function(resp){
				callback(resp);
			});
		},
		
		random : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("random"), function(resp){
				callback(resp);
			});
		},
		
		scanchain : function(offset, depth, callback){
			var msg 			= _createSimpleMessage("scanchain");
			msg.params.offset  	= offset;
			msg.params.depth  	= depth;
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		},
		
		gettxpow : function(txpowid, callback){
			var msg = _createSimpleMessage("gettxpow");
			msg.params.txpowid  = txpowid;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		},
		
		checktxpow : function(txpowid, callback){
			var msg = _createSimpleMessage("checktxpow");
			msg.params.txpowid  = txpowid;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		},
		
		listcoins : function(address, tokenid, callback){
			var msg = _createSimpleMessage("gettxpow");
			msg.params.address  = address;
			msg.params.tokenid  = tokenid;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		}
	}
}

/**
 * Message handling - all done in the background
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
		MDS.log("MiniMask Request not found : "+JSON.stringify(msg));
	}
	
	//Now remove that elemnt
	MINIMASK_REQUESTS = MINIMASK_REQUESTS.filter(function(item) {
	    return item.randid !== randid;
	});
	
}
window.addEventListener("message", windowReceiveMessage, false);


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
	
	if(MINIMASK_LOGGING){
		console.log("MiniMask Request : "+JSON.stringify(msg));	
	}
	
	//Send this to the top window.. origin /
	window.postMessage(msg);
}

//Utility functions
function _createSimpleMessage(func){
	var msg  		= {};
	msg.command 	= func;
	msg.params 		= {};
	return msg;
} 

