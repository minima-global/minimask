/**
 * MEG Host details
 */
MINIMASK_MEG_HOST 			= "http://127.0.0.1:8080/";
//MINIMASK_MEG_HOST 			= "https://minimask.org:8888/";
MINIMASK_MEG_USER 			= "apicaller";
MINIMASK_MEG_PASSWORD 		= "apicaller";

var MINIMASK_USER_DETAILS 	= {};

MINIMASK_USER_DETAILS.LOGGEDON						= false;
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS 		= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY 	= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY	= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_SCRIPT 		= "";

var SERVICE_LOGGING = false;

/**
 * Convert Command to actual function
 */
function convertMessageToAction(msg){

	var ret 		= {};
	
	ret.command		= msg.command;
	ret.webcall 	= false;
	ret.internal 	= false;
	ret.pending 	= false;
	ret.url 		= "";
	ret.params 		= {};
	ret.response	= {};
	
	//Some calls are invalid from external
	ret.valid 		= true;
		
	//WEBCALL functions
	if(msg.command ==  "create"){
		ret.webcall = true;
		ret.url 	= MINIMASK_MEG_HOST+"wallet/create";
	
	}else if(msg.command ==  "send"){
		
		ret.webcall 			= true;
		ret.url 				= MINIMASK_MEG_HOST+"wallet/send";
		ret.params.amount 		= msg.params.amount;
		ret.params.toaddress 	= msg.params.toaddress;
		ret.params.tokenid 		= msg.params.tokenid;
		ret.params.fromaddress 	= msg.params.fromaddress;
		ret.params.privatekey 	= msg.params.privatekey;
		ret.params.script 		= msg.params.script;				
		ret.params.keyuses 		= msg.params.keyuses;
							
	}else if(msg.command ==  "block"){
		ret.webcall = true;
		ret.url 	= MINIMASK_MEG_HOST+"wallet/block";
	
	}else if(msg.command ==  "random"){
		ret.webcall = true;
		ret.url 	= MINIMASK_MEG_HOST+"wallet/random";
	
	}else if(msg.command ==  "scanchain"){
		ret.webcall 		= true;
		
		ret.url 			= MINIMASK_MEG_HOST+"wallet/scanchain";
		
		//Max 64 depth
		ret.params.depth 	= +msg.params.depth;
		if(ret.params.depth > 64){
			ret.params.depth = 64;
		}
		
		ret.params.offset 	= msg.params.offset;
	
	}else if(msg.command ==  "gettxpow"){
		ret.webcall 		= true;
		ret.url 			= MINIMASK_MEG_HOST+"wallet/gettxpow";
		ret.params.txpowid 	= msg.params.txpowid;
				
	}else if(msg.command ==  "checktxpow"){
		ret.webcall 		= true;
		ret.url 			= MINIMASK_MEG_HOST+"wallet/checktxpow";
		ret.params.txpowid 	= msg.params.txpowid;
	
	}else if(msg.command ==  "balance"){
		ret.webcall 		= true;
		ret.url 			= MINIMASK_MEG_HOST+"wallet/balance";
		ret.params.address 	= msg.params.address;
	
	}else if(msg.command ==  "listcoins"){
		ret.webcall 		= true;
		ret.url 			= MINIMASK_MEG_HOST+"wallet/listcoins";
		ret.params.address 	= msg.params.address;
		ret.params.tokenid 	= msg.params.tokenid;
						
	
	}else if(msg.command ==  "account_balance"){
		
		//Check we are logged in..
		if(!MINIMASK_USER_DETAILS.LOGGEDON){
			ret.status 	= false;
			ret.error 	= "Not logged in..";	
			return ret;
		}
		
		ret.webcall 		= true;
		ret.url 			= MINIMASK_MEG_HOST+"wallet/balance";
		ret.params.address 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;

	}else if(msg.command ==  "account_send"){
		
		//Check we are logged in..
		if(!MINIMASK_USER_DETAILS.LOGGEDON){
			ret.status 	= false;
			ret.error 	= "Not logged in..";	
			return ret;
		}
			
		//Set the main params
		ret.params.amount 		= msg.params.amount;
		ret.params.toaddress 	= msg.params.address;
		ret.params.tokenid 		= msg.params.tokenid;
		ret.params.state 		= msg.params.state;
				
		//Is this internal.. ?
		if(msg.external){
			ret.pending = true;
			return ret;	
		}
		
		ret.webcall 			= true;
		ret.url 				= MINIMASK_MEG_HOST+"wallet/send";
		ret.params.fromaddress 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;
		ret.params.privatekey 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY;
		ret.params.script 		= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_SCRIPT;				
		ret.params.mine 		= false;
		
		//Set the Key Uses
		ret.params.keyuses 		= msg.params.keyuses;
		
		//Increment
		var newkeyuses = +msg.params.keyuses +1;
		setKeyUses(MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY, newkeyuses, function(res){});		
							
	//NOT WEB CALLS
	}else if(msg.command ==  "account_getaddress"){
		
		//Check we are logged in..
		if(!MINIMASK_USER_DETAILS.LOGGEDON){
			ret.status 	= false;
			ret.error 	= "Not logged in..";	
			return ret;
		}
		
		ret.status 		 	 = true;
		ret.response.address = MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;
	
	}else if(msg.command ==  "account_getpublickey"){
		
		//Check we are logged in..
		if(!MINIMASK_USER_DETAILS.LOGGEDON){
			ret.status 	= false;
			ret.error 	= "Not logged in..";	
			return ret;
		}
		
		ret.status 		 		= true;
		ret.response.publickey 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY;
			
	//INTERNAL Messages
	}else if(msg.command ==  "account_generate"){
		
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 			= true;	
		ret.url 				= MINIMASK_USER_DETAILS.MINIMASK_MEG_HOST+"wallet/seedphrase";
		ret.params.seedphrase 	= msg.params.seedphrase;
								
	}else if(msg.command ==  "minimask_extension_init"){
		ret.internal 		= true;	
	
	}else if(msg.command ==  "minimask_extension_logout"){
		
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
			
		ret.internal 		= true;	
					
	}else if(msg.command ==  "account_pending"){
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
				
		ret.internal 		= true;
	
	}else if(msg.command ==  "account_remove_pending"){
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
				
		ret.internal 		= true;
		ret.params.removeid	= msg.params.removeid;
	
	}else if(msg.command ==  "account_get_key_uses"){
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 		= true;
		
	}else if(msg.command ==  "account_set_key_uses"){
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 		 = true;
		ret.params.amount	 = msg.params.amount;
									
	//UNKNOWN	
	}else{
		ret.status 	= false;
		ret.error 	= "Unknown command : "+msg.command;
	}
	
	return ret;	
}

/**
 * Listen for messages
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  	
	//Send back response	
	var resp 		= {};
	resp.pending 	= false;
		
	if(SERVICE_LOGGING){
		console.log("Service Worker Received Command : "+JSON.stringify(request));	
	}
	
	//Is this from the Extension!
	var fromext 	= !sender.origin.startsWith("chrome-extension://"+chrome.runtime.id);
	var saysfromext = ( request.external == true );
	if(fromext != saysfromext){
		console.log("ERROR : Message origin says internal but not from extension .. request:"+JSON.stringify(request)+" sender:"+JSON.stringify(sender));
	
		//Invalid action
		resp.status 	= false;
		resp.pending 	= false;
		resp.error 		= "Invalid action..";
		
		sendResponse(resp);
		return;
	}
	
	//Convert to a function
	var action 		= convertMessageToAction(request);
	
	//Set the sender
	action.sender	= sender;
	
	if(SERVICE_LOGGING){
		console.log("Service Worker Converted Command : "+JSON.stringify(action));
	}
	
	if(!action.valid){
		
		//Invalid action
		resp.status 	= false;
		resp.pending 	= false;
		resp.error 		= "Invalid action..";
		
		sendResponse(resp);	
		
	}else if(action.pending){
		
		addPendingTxn(action, function(res){
			//Send Back..
			resp.status 	= false;
			resp.pending 	= true;
			resp.error 		= "Added command to Pending actions..";
			
			var datajson 		= {};
			datajson.command 	= action.command;
			datajson.params 	= action.params;
			resp.data			= datajson; 
			
			sendResponse(resp);
		});
		
		return true;
		
	}else if(action.internal){
		
		resp.status = true;
					
		if(action.command == "account_generate"){
			
			makePostRequest(MINIMASK_MEG_HOST+"wallet/seedphrase", action.params, function(res){
				
				if(!res.status){
					resp.status = false;
					sendResponse(resp);
					
				}else{
					console.log("Service Worker account_generate : "+JSON.stringify(res));
					
					//Store the data
					MINIMASK_USER_DETAILS.LOGGEDON						= true;
					MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS 		= res.response.miniaddress;
					MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY 	= res.response.publickey;
					MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY	= res.response.privatekey;
					MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_SCRIPT 		= res.response.script;
					
					//Store these details
					storeUserDetails(MINIMASK_USER_DETAILS, function(){
						sendResponse(resp);		
					});
				}							
			});
			
		}else if(action.command == "minimask_extension_init"){
			
			//Are we logged in..
			retrieveUserDetails(function(details){
				
				resp.data 			= {};
				resp.data.loggedon 	= false;
				
				if(details.user_details){
					if(details.user_details.LOGGEDON){
						resp.data.loggedon 	= true;
											
						//Set the details..
						MINIMASK_USER_DETAILS = details.user_details;
						
						//Set some details
						resp.data.address 		= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;
						resp.data.publickey 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY;	
					}
				}
				
				sendResponse(resp);				
			});
			
		}else if(action.command == "minimask_extension_logout"){
			
			storeUserDetails({}, function(){
				clearPendingTxns(function(){
					
					//Reset details
					MINIMASK_USER_DETAILS = {};
					MINIMASK_USER_DETAILS.LOGGEDON = false;
					
					sendResponse(resp);	
				});
			});	
			
		}else if(action.command == "account_pending"){
			
			getPendingTxns(function(allpending){
				resp.data = allpending;
				sendResponse(resp);
			});
			
			
		}else if(action.command == "account_remove_pending"){
			
			removePendingTxn(action.params.removeid, function(allpending){
				
				console.log("REMOVED PENDING and send response : "+JSON.stringify(allpending));
				
				resp.data = allpending;
				sendResponse(resp);
			});	
		
		
		}else if(action.command == "account_get_key_uses"){
					
			getKeyUse(MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY, function(res){
				resp.data = res;
				sendResponse(resp);
			});	
				
		}else if(action.command == "account_set_key_uses"){
						
			setKeyUses(MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY, action.params.amount, function(res){
				resp.data = res;
				sendResponse(resp);
			});	
		
		}
		
		return true;
		
	}else if(action.webcall){
			
		//Call MEG
		makePostRequest(action.url, action.params, function(res){
			if(SERVICE_LOGGING){
				console.log("Post Response : "+JSON.stringify(res));
			}
			
			//ONLY send back the response
			resp.status = res.status;
			
			//Success or fail
			if(!resp.status){
				resp.error 	= res.error;
			}else{
				resp.data	= res.response;	
			}
			
			sendResponse(resp);
		});
		
		return true;
			
	}else{
		//ONLY send back the response
		resp.status = action.status;
		
		//Success or fail
		if(!resp.status){
			resp.error = action.error;
		}else{
			resp.data	= action.response;	
		}
		
		//No webcall required.. just send answer back
		sendResponse(resp);
	}
});


/**
 * Make a POST request to MEG
 */
async function makePostRequest(url, jsonparams, callback){
	
	//The username and password
	var userpass = MINIMASK_MEG_USER+":"+MINIMASK_MEG_PASSWORD;
	
	//Creatye headers with AUTH params	
	let headers = new Headers();
	headers.append('Authorization', 'Basic ' + btoa(userpass));
	headers.append('Content-Type', 'application/x-www-form-urlencoded');
	
	//Convert JSON to URL params
	var urlparams = Object.keys(jsonparams)
	  .filter(function (key) {
	    return jsonparams[key] ? true : false
	  })
	  .map(function (key) {
	    return encodeURIComponent(key) + '=' + encodeURIComponent(jsonparams[key])
	  })
	  .join('&');
	  
	try{
		const response = await fetch(url, {
		  method: "POST",
		  headers: headers,
		  body: urlparams,
		  // …
		});
		
		if (!response.ok) {
			var resp 		= {};
			resp.status 	= false;
			resp.error 		= "Call error "+response.status;
			
			callback(resp);
			
	    }else{
			//Wait for the response
		    const result = await response.json();
			
			//Send result back
			callback(result) ;	
		}
		
	}catch(error){
		var resp 		= {};
		resp.status 	= false;
		resp.error 		= "Could not contact : "+url;
		
		callback(resp);
	}
}

/**
 * Save / Load User data
 */
function storeUserDetails(data, callback){
	chrome.storage.session.set({ user_details : data }).then(() => {
		callback();  
	});
}

function retrieveUserDetails(callback){
	chrome.storage.session.get(["user_details"]).then((result) => {
	  	callback(result);
	});
}

/**
 * Key Uses
 */
function setKeyUses(publickey, amount, callback){
	
	getAllKeyUses(function(allkeys){
		
		//Get the array
		var karr = allkeys.key_uses;
				
		//Set for this public key		
		karr[""+publickey] = amount;
				
		chrome.storage.local.set({ key_uses : karr }).then(() => {
			if(callback){
				callback(allkeys);	
			}
		});	
	});
}

function getAllKeyUses(callback){
	chrome.storage.local.get({ key_uses : {} }).then((result) => {
	  	callback(result);	
	});
}

function getKeyUse(publickey, callback){
	getAllKeyUses(function(allkeys){
		
		var karr = allkeys.key_uses;
		
		//Does sit exist
		if(karr[""+publickey]){
			callback(karr[""+publickey]);
		}
		
		callback(0);
	});
}

/**
 * Pending Txns
 */
function getPendingTxns(callback){
	chrome.storage.session.get({ pending_txns : [] }).then((result) => {
	  	callback(result);	
	});
}

function clearPendingTxns(callback){
	chrome.storage.session.set({ pending_txns : [] }).then((result) => {
		callback(result);	
	});
}

function addPendingTxn(pendingtxn, callback){
	
	//Get the curent list
	getPendingTxns(function(pending){
		
		//And add this..
		pending.pending_txns.push(pendingtxn);
		
		//And now set again..
		chrome.storage.session.set({ pending_txns : pending.pending_txns }).then(() => {
			if(callback){
				callback(pending);	
			}
		});	
	});
	
}

function removePendingTxn(id, callback){
	
	//Get the curent list
	getPendingTxns(function(pending){
		
		//Remove
		pending.pending_txns.splice(id,1);
		
		//And now set again..
		chrome.storage.session.set({ pending_txns : pending.pending_txns }).then(() => {
			if(callback){
				callback(pending);	
			}
		});	
	});
	
}


