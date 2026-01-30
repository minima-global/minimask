
/**
 * Main MinimMask Object for all interaction
 */
var MINIMASK = {
	
	/**
	 * Main Callback for pending actions
	 */
	MAIN_MINIMASK_CALLBACK : null,
			
	/**
	 * MINIMASK Startup
	 */
	init : function(callback){
		
		//Save this to send back pending responses
		MAIN_MINIMASK_CALLBACK = callback;
		
		//Set a Timer to POLL for messages - Pending / Login etc
		setInterval(function(){
			
			var msg 				= _createSimpleMessage("pending_messages");
			msg.params.pendinglist 	= PENDING_UID_LIST;
						
			postMessageToServiceWorker(msg, function(resp){
				
				for(var i=0;i<resp.data.length;i++){
					
					var pendingaction 	= resp.data[i];
					var puid 			= pendingaction.pendinguid;
									
					//Remove from list
					removeMiniMaskPendinUID(puid);
					
					var mini_msg 	= {};
					mini_msg.event 	= "MINIMASK_PENDING";
					mini_msg.data 	= pendingaction;
								
					//Send back to user
					MAIN_MINIMASK_CALLBACK(mini_msg); 
				}
			});
		}, 2000);
		
		//Get Init details
		postMessageToServiceWorker(_createSimpleMessage("minimask_extension_init"), function(resp){
			
			var mini_msg 	= {};
			mini_msg.event 	= "MINIMASK_INIT";
			mini_msg.data 	= resp;
			
			if(callback){
				callback(mini_msg);	
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
				
				//Will result in a pending!
				if(resp.pending){
					//Add pending UID to our check list
					addMiniMaskPendinUID(resp.pendinguid);					
				
					//console.log("ADDED PENDING_LIST : "+JSON.stringify(PENDING_UID_LIST));
				}
				
				callback(resp);
			});
		},
		
		/**
		 * Sign a transaction created with MINIMASK.meg.rawtxn - will create a Pending transaction
		 */
		sign : function(txndata, post, callback){
			
			var msg = _createSimpleMessage("account_sign");
			
			msg.params.data = txndata;
			msg.params.post = post;
			
			postMessageToServiceWorker(msg, function(resp){
				
				//Will result in a pending!
				if(resp.pending){
					//Add pending UID to our check list
					addMiniMaskPendinUID(resp.pendinguid);					
				
					//console.log("ADDED TO PENDING_LIST : "+JSON.stringify(PENDING_UID_LIST));
				}
				
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
		
		createseed : function(seedphrase, callback){
			
			var msg = _createSimpleMessage("createseed");
			msg.params.seedphrase = seedphrase;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});	
		},
		
		balance : function(address, callback){
			//Run full balance..
			fullbalance(address, 3, false, false, callback);	
		},
		
		balancefull : function(address, confirmations, coinlist, tokendetails, callback){
			var msg = _createSimpleMessage("balance");
			
			msg.params.address  		= address;
			msg.params.confirmations  	= confirmations;
			msg.params.coinlist  		= coinlist;
			msg.params.tokendetails		= tokendetails;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		},
		
		send : function(amount, toaddress, tokenid, fromaddress, privatekey, script, keyuses, split, callback){
			var msg = _createSimpleMessage("send");
			
			msg.params.amount  		= ""+amount;
			msg.params.toaddress  	= toaddress;
			msg.params.tokenid  	= tokenid;
			msg.params.fromaddress  = fromaddress;
			msg.params.privatekey  	= privatekey;
			msg.params.script  		= script;
			msg.params.keyuses  	= keyuses;
			msg.params.split  		= split;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});	
		},
		
		rawtxn : function(inputs, outputs, scripts, state, callback){
			var msg = _createSimpleMessage("rawtxn");
			
			msg.params.inputs  		= JSON.stringify(inputs);
			msg.params.outputs  	= JSON.stringify(outputs);
			msg.params.scripts  	= JSON.stringify(scripts);
			msg.params.state 	 	= JSON.stringify(state);
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});	
		},
		
		signtxn : function(txndata, privatekey, keyuses, post, callback){
			
			var msg = _createSimpleMessage("signtxn");	
			
			msg.params.data  		= txndata;
			msg.params.privatekey  	= privatekey;
			msg.params.keyuses  	= keyuses;
			msg.params.post  		= post;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});
		},
		
		posttxn : function(txndata, callback){
			var msg = _createSimpleMessage("posttxn");
			
			msg.params.data = txndata;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});	
		},
		
		viewtxn : function(txndata, callback){
			var msg	= _createSimpleMessage("viewtxn");
			
			msg.params.data = txndata;
			
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
		console.log("MiniMask Request not found : "+JSON.stringify(msg));
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

/**
 * Pending messages
 */
var PENDING_UID_LIST = [];

function addMiniMaskPendinUID(uid){
	PENDING_UID_LIST.push(uid);
}

function removeMiniMaskPendinUID(uid){
	//Now remove that elemnt
	PENDING_UID_LIST = PENDING_UID_LIST.filter(function(itemuid) {
	    return itemuid !== uid;
	});
}

/**
 * Utility functions
 */
function _createSimpleMessage(func){
	var msg  		= {};
	msg.command 	= func;
	msg.params 		= {};
	return msg;
} 

