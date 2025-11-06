
/**
 * Main MinimMask Object for all interaction
 */
var MAIN_MINIMASK_CALLBACK = null;

var MINIMASK = {
			
	/**
	 * MINIMASK Startup
	 */
	init : function(callback){
		
		//Log a little..
		console.log("Initialising MiniMask..");
		
		MAIN_MINIMASK_CALLBACK = callback;
		
		//Get Init details
		postMessageToServiceWorker(_createSimpleMessage("minimask_extension_init"), function(resp){
			if(callback){
				callback(resp);	
			}
		});
	},
	
	/**
	 * Access the MiniMask Account
	 */
	account : {
		
		/**
		 * Get the balance of all tokens for this address
		 */
		balance : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_balance"), function(resp){
				callback(resp);
			});
		},
		
		/**
		 * Get all coins for this address
		 */
		coins : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_coins"), function(resp){
				callback(resp);
			});
		},
	
		/**
		 * Get the address for the logged in account
		 */
		getAddress : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_getaddress"), function(resp){
				callback(resp);
			});
		},
		
		/**
		 * Get the public key for the logged in account
		 */
		getPublicKey : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_getpublickey"), function(resp){
				callback(resp);
			});
		},
		
		/**
		 * Send funds from this account - will create a PENDING transaction 
		 */
		send : function(amount, address, tokenid, state, callback){
			var msg = _createSimpleMessage("account_send");
			
			msg.params.amount  	= ""+amount;
			msg.params.address 	= address;
			msg.params.tokenid 	= tokenid;
			msg.params.state 	= JSON.stringify(state);
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		}
	},
	
	/**
	 * Call MEG functions directly
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
		
		rawtransaction : function(inputs, outputs, scripts, state, callback){
			var msg = _createSimpleMessage("rawtxn");
			
			msg.params.inputs  		= JSON.stringify(inputs);
			msg.params.outputs  	= JSON.stringify(outputs);
			msg.params.scripts  	= JSON.stringify(scripts);
			msg.params.state 	 	= JSON.stringify(state);
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});	
		},
		
		sign : function(txndata, privatekey, keyuses, callback){
			var msg = _createSimpleMessage("signtxn");
			
			msg.params.data  		= txndata;
			msg.params.privatekey  	= privatekey;
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
		
		listcoins : function(address, tokenid, state, callback){
			var msg = _createSimpleMessage("listcoins");
			
			//MUST add an address
			msg.params.address  = address;
			
			//Can leave blank - search for all tokens.. need 0x01 ro overide default in MEG
			if(tokenid == ""){
				msg.params.tokenid = "0x01";
			}else{
				msg.params.tokenid  = tokenid;	
			}
			
			//Can leave blank
			msg.params.state  = state;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		},
		
		random : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("random"), function(resp){
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

