/**
 * MEG Host details
 */

//MEG HOST Details
MINIMASK_MEG_HOST 			= "";
MINIMASK_MEG_USER 			= "";
MINIMASK_MEG_PASSWORD 		= "";

//Default Settings
DEFAULT_MINIMASK_MEG_HOST 		= "https://minimask.org:8888/";
DEFAULT_MINIMASK_MEG_USER 		= "apicaller";
DEFAULT_MINIMASK_MEG_PASSWORD 	= "apicaller";

var MINIMASK_USER_DETAILS 	= {};

MINIMASK_USER_DETAILS.LOGGEDON						= false;
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS 		= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY 	= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY	= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_SCRIPT 		= "";

var SERVICE_LOGGING = false;
var WEB_LOGGING 	= true;

/**
 * Get the current MEG Host
 */
function getCurrentMEGFunctionCall(func){
	return MINIMASK_MEG_HOST+func;
}

/**
 * Convert Command to actual function
 */
function convertMessageToAction(msg){

	var ret 		= {};
	
	ret.command		= msg.command;
	ret.webcall 	= false;
	ret.cached 		= false;
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
		ret.url 	= getCurrentMEGFunctionCall("wallet/create");
	
	}else if(msg.command ==  "send"){
		
		ret.webcall 			= true;
		ret.url 				= getCurrentMEGFunctionCall("wallet/send");
		ret.params.amount 		= ""+msg.params.amount;
		ret.params.toaddress 	= msg.params.toaddress;
		ret.params.tokenid 		= msg.params.tokenid;
		ret.params.fromaddress 	= msg.params.fromaddress;
		ret.params.privatekey 	= msg.params.privatekey;
		ret.params.script 		= msg.params.script;				
		ret.params.keyuses 		= msg.params.keyuses;
		ret.params.split 		= msg.params.split;
							
	}else if(msg.command ==  "rawtxn"){
			
		ret.webcall 			= true;
		ret.url 				= getCurrentMEGFunctionCall("wallet/rawtxn");
		
		ret.params.inputs 		= msg.params.inputs;
		ret.params.outputs 		= msg.params.outputs;
		ret.params.scripts 		= msg.params.scripts;
		ret.params.state 		= msg.params.state;
		
	}else if(msg.command ==  "signtxn"){
				
		ret.webcall 			= true;
		ret.url 				= getCurrentMEGFunctionCall("wallet/signtxn");
		
		ret.params.data 		= msg.params.data;
		ret.params.privatekey 	= msg.params.privatekey;
		ret.params.keyuses 		= msg.params.keyuses;
		ret.params.post 		= msg.params.post;
		
	}else if(msg.command ==  "posttxn"){
					
		ret.webcall 			= true;
		ret.url 				= getCurrentMEGFunctionCall("wallet/posttxn");
		
		ret.params.data 		= msg.params.data;
		
	}else if(msg.command ==  "viewtxn"){
		ret.webcall 			= true;
		ret.cached 				= true;
		ret.url 				= getCurrentMEGFunctionCall("wallet/viewtxn");
		
		ret.params.data 		= msg.params.data;
			
	}else if(msg.command ==  "block"){
		ret.webcall 		= true;
		ret.cached 			= true;
		ret.url 			= getCurrentMEGFunctionCall("wallet/block");
	
	}else if(msg.command ==  "random"){
		ret.webcall 		= true;
		ret.url 			= getCurrentMEGFunctionCall("wallet/random");
	
	}else if(msg.command ==  "scanchain"){
		ret.webcall 		= true;
		ret.cached 			= true;
		
		ret.url 			= getCurrentMEGFunctionCall("wallet/scanchain");
		
		//Max 64 depth
		ret.params.depth 	= +msg.params.depth;
		if(ret.params.depth > 32){
			ret.params.depth = 32;
		}
		
		ret.params.offset 	= msg.params.offset;
	
	}else if(msg.command ==  "gettxpow"){
		ret.webcall 		= true;
		ret.cached 			= true;
		ret.url 			= getCurrentMEGFunctionCall("wallet/gettxpow");
		ret.params.txpowid 	= msg.params.txpowid;
				
	}else if(msg.command ==  "checktxpow"){
		ret.webcall 		= true;
		ret.cached 			= true;
		ret.url 			= getCurrentMEGFunctionCall("wallet/checktxpow");
		ret.params.txpowid 	= msg.params.txpowid;
	
	}else if(msg.command ==  "balance"){
		ret.webcall 				= true;
		ret.cached 					= true;
		ret.url 					= getCurrentMEGFunctionCall("wallet/balance");
		ret.params.address 			= msg.params.address;
		ret.params.confirmations 	= msg.params.confirmations;
		ret.params.coinlist 		= msg.params.coinlist;
		ret.params.tokendetails 	= msg.params.tokendetails;
	
	}else if(msg.command ==  "listcoins"){
		ret.webcall 		= true;
		ret.cached 			= true;
		ret.url 			= getCurrentMEGFunctionCall("wallet/listcoins");
		ret.params.address 	= msg.params.address;
		ret.params.tokenid 	= msg.params.tokenid;
		
		//Check for state ?
		if(msg.params.state != ""){
			ret.params.state = msg.params.state;	
		}
	
	}else if(msg.command ==  "account_coins"){
		
		//Check we are logged in..
		if(!MINIMASK_USER_DETAILS.LOGGEDON){
			ret.status 	= false;
			ret.error 	= "Not logged in..";	
			return ret;
		}
		
		ret.webcall 		= true;
		ret.cached 			= true;
		ret.url 			= getCurrentMEGFunctionCall("wallet/listcoins");
		ret.params.address 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;
							
	}else if(msg.command ==  "account_balance"){
		
		//Check we are logged in..
		if(!MINIMASK_USER_DETAILS.LOGGEDON){
			ret.status 	= false;
			ret.error 	= "Not logged in..";	
			return ret;
		}
		
		ret.webcall 		= true;
		ret.cached 			= true;
		ret.url 			= getCurrentMEGFunctionCall("wallet/balance");
		ret.params.address 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;

	}else if(msg.command ==  "account_send"){
		
		//Check we are logged in..
		if(!MINIMASK_USER_DETAILS.LOGGEDON){
			ret.status 	= false;
			ret.error 	= "Not logged in..";	
			return ret;
		}
			
		//Set the main params
		ret.params.amount 		= ""+msg.params.amount;
		ret.params.toaddress 	= msg.params.address;
		ret.params.tokenid 		= msg.params.tokenid;
		
		//Is there a state
		if(msg.params.state != "{}"){
			ret.params.state 		= msg.params.state;	
		}
				
		//Is this internal.. ?
		if(msg.external){
			ret.pending 	= true;
			ret.pendinguid 	= getRandomHexString();
			return ret;	
		}
		
		ret.webcall 			= true;
		ret.url 				= getCurrentMEGFunctionCall("wallet/send");
		ret.params.fromaddress 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;
		ret.params.privatekey 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY;
		ret.params.script 		= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_SCRIPT;				
		ret.params.mine 		= true;
		
		//Set the Key Uses
		ret.params.keyuses 		= msg.params.keyuses;
		
		//Increment
		var newkeyuses = +msg.params.keyuses +1;
		setKeyUses(MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY, newkeyuses, function(res){});		
	
	}else if(msg.command ==  "account_sign"){
				
		//Check we are logged in..
		if(!MINIMASK_USER_DETAILS.LOGGEDON){
			ret.status 	= false;
			ret.error 	= "Not logged in..";	
			return ret;
		}
			
		//Set the main params
		ret.params.data 		= msg.params.data;
		ret.params.post 		= msg.params.post;
				
		//Is this internal.. ?
		if(msg.external){
			ret.pending 	= true;
			ret.pendinguid 	= getRandomHexString();
			return ret;	
		}
		
		ret.webcall 			= true;
		ret.url 				= getCurrentMEGFunctionCall("wallet/signtxn");
		
		ret.params.privatekey 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY;
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
		ret.url 				= getCurrentMEGFunctionCall("wallet/seedphrase");
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
	
	}else if(msg.command ==  "account_sent_pending"){
		
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 		= true;
		ret.pendingmsg		= msg.pendingmsg;
		ret.pendingresp		= msg.pendingresp;
	
	}else if(msg.command ==  "account_get_key_uses"){
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 		= true;
		
	}else if(msg.command ==  "account_set_key_uses"){
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 		 = true;
		ret.params.amount	 = msg.params.amount;
									
	}else if(msg.command ==  "account_init_meg"){
		
		//Not allowed from external
		//if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 		= true;
		
	}else if(msg.command ==  "account_get_custom_meg"){

		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 		= true;
		
	}else if(msg.command ==  "account_set_custom_meg"){
		
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
		
		ret.internal 		= true;
		ret.params	 		= msg.params;
									
	}else if(msg.command ==  "pending_messages"){
	
		//Not allowed from external
		if(msg.external){ret.valid=false;return ret;}
				
		//Are there any messages to send back..
		ret.internal 			= true;
		
		ret.params.pendinglist 	= msg.params.pendinglist;
		
	//UNKNOWN	
	}else{
		ret.valid	= false
		ret.status 	= false;
		ret.error 	= "Unknown command : "+msg.command;
	}
	
	return ret;	
}

/**
 * Listen for messages - MAIN ENTRY POINT
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	
	console.log("Service Worker Received Command : "+JSON.stringify(request));
	
	//Check MEG setup..
	if(MINIMASK_MEG_HOST == ""){
		
		console.log("MEG host requires setting..");
			
		//Set the host..
		setupMEGConnectDetails(function(){
			
			//And process the request
			_processMiniRequest(request, sender, sendResponse);
		});
		
	}else{
		//Just process request
		_processMiniRequest(request, sender, sendResponse);
	}
	
	return true;
});
	
function _processMiniRequest(request, sender, sendResponse){
	 	
	//Send back response	
	var resp 		= {};
	resp.pending 	= false;
		
	if(SERVICE_LOGGING){
		console.log("Service Worker Received Command : "+JSON.stringify(request));	
	}
	
	//Is this an external or Internal request
	request.external = !sender.origin.startsWith("chrome-extension://"+chrome.runtime.id);
	
	//Convert to a function
	var action 		= convertMessageToAction(request);
	
	//Set the sender
	action.sender	= sender;
	
	if(SERVICE_LOGGING){
		console.log("Service Worker Converted Command : "+JSON.stringify(action));
	}
	
	//What was the command
	var datajson 		= {};
	datajson.command 	= action.command;
	datajson.params 	= action.params;
	
	if(!action.valid){
		
		//Invalid action
		resp.status 	= false;
		resp.pending 	= false;
		resp.error 		= "Invalid action..";
		resp.data		= datajson;
		
		sendResponse(resp);	
		
	}else if(action.pending){
		
		addPendingTxn(action, function(res){
			//Send Back..
			resp.status 		= false;
			resp.pending 		= true;
			resp.pendinguid 	= action.pendinguid;
			resp.error 			= "Added command to Pending actions..";
			resp.data			= datajson; 
			
			sendResponse(resp);
		});
		
	}else if(action.internal){
		
		resp.status = true;
					
		if(action.command == "account_generate"){
			
			makePostRequest(getCurrentMEGFunctionCall("wallet/seedphrase"), action.params, function(res){
				
				if(!res.status){
					resp.status = false;
					resp.error  = res.error;
					
					sendResponse(resp);
					
				}else{
					
					//Store the data
					MINIMASK_USER_DETAILS.LOGGEDON						= true;
					MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS 		= res.response.miniaddress;
					MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY 	= res.response.publickey;
					MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY	= res.response.privatekey;
					MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_SCRIPT 		= res.response.script;
					
					//Store these details
					/*storeUserDetails(MINIMASK_USER_DETAILS, function(){
						sendResponse(resp);		
					});*/
					
					//Send back details
					sendResponse(resp);
				}							
			});
			
		}else if(action.command == "minimask_extension_init"){
			
			//Are we logged in..
			/*retrieveUserDetails(function(details){
				
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
				
				//Load the MEG settings..
				setupMEGConnectDetails(function(){
					sendResponse(resp);	
				});				
			});*/
			
			//Details are in RAM
			resp.data 			= {};
			resp.data.loggedon 	= MINIMASK_USER_DETAILS.LOGGEDON;

			if(MINIMASK_USER_DETAILS.LOGGEDON){
				//Set some details
				resp.data.address 		= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;
				resp.data.publickey 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY;
			}							
			
			sendResponse(resp);	
					
		}else if(action.command == "minimask_extension_logout"){
			
			/*storeUserDetails({}, function(){
				clearPendingTxns(function(){
					
					//Reset details
					MINIMASK_USER_DETAILS = {};
					MINIMASK_USER_DETAILS.LOGGEDON = false;
					
					sendResponse(resp);	
				});
			});*/
			
			clearPendingTxns(function(){
				
				//Reset details
				MINIMASK_USER_DETAILS = {};
				MINIMASK_USER_DETAILS.LOGGEDON = false;
				
				sendResponse(resp);	
			});
		
		}else if(action.command == "account_pending"){
			
			getPendingTxns(function(allpending){
				resp.data = allpending;
				sendResponse(resp);
			});
			
		}else if(action.command == "account_remove_pending"){
			
			removePendingTxn(action.params.removeid, function(allpending){
				
				resp.data = allpending;
				sendResponse(resp);
			});	

		}else if(action.command == "account_sent_pending"){
		
			//Create the full pending action+resp
			var fullpending 		= {};
			fullpending.pendingmsg 	= action.pendingmsg;
			fullpending.pendingresp = action.pendingresp;
			
			//Add this to our stack
			addPendingSentMessage(fullpending);
			
			sendResponse(resp);
			
		}else if(action.command == "pending_messages"){
					
			//Get the list..
			var checkpending = action.params.pendinglist;
			var found 		 = [];
			
			//Cycle through the list..
			for(var i=0;i<checkpending.length;i++){
				for(var j=0;j<PENDING_SENT_MESSAGES.length;j++){
				
					psmsg = PENDING_SENT_MESSAGES[j];
					
					var checkuid  = checkpending[i];
					var psentuid  = psmsg.pendingmsg.pendinguid;
					
					//Found a match ?
					if(checkuid == psentuid){
						
						var userpendmsg 		= {};
						userpendmsg.pendinguid 	= psmsg.pendingmsg.pendinguid;
						userpendmsg.action  	= psmsg.pendingmsg.command;
						userpendmsg.params  	= psmsg.pendingmsg.params;
						userpendmsg.response  	= psmsg.pendingresp;
						
						found.push(userpendmsg);
						
						//REMOVE THIS FROM OUR LIST NOW
						removePendingSentMessage(psmsg.pendingmsg.pendinguid);
					}
				}
			}
			
			//Sent the list back
			resp.data 	= found;
			
			sendResponse(resp);
				
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
		
		}else if(action.command == "account_init_meg"){
									
			setupMEGConnectDetails(function(){
				resp.data = "MEG Host setup..";
				sendResponse(resp);	
			});
				
		}else if(action.command == "account_get_custom_meg"){
							
			retrieveCustomMEGDetails(function(res){
				resp.data = res;
				sendResponse(resp);
			});	
				
		}else if(action.command == "account_set_custom_meg"){
			
			//Wipe the cache..
			wipeCachedCalls();
			
			//Clear Pending..
			clearPendingTxns(function(){
				storeCustomMEGDetails(action.params, function(res){
					resp.data = action.params;
					
					//Reset the details!
					setupMEGConnectDetails(function(){
						
						//Send back th eresponse..	
						sendResponse(resp);	
					});
				});		
			});
		}
		
	}else if(action.webcall){
		
		//Is it a cached call..
		var foundcache = null;
		if(action.cached){
			
			//Check the cache!
			foundcache = getCachedWebCall(action.url, action.params);
			
			//Send this back
			if(foundcache != null){
				sendResponse(foundcache.response);	
				return;
			}		
		}
		
		if(WEB_LOGGING){
			console.log("Web Call -> url:"+action.url+" params:"+JSON.stringify(action.params));
		}	
		
		//Call MEG
		makePostRequest(action.url, action.params, function(res){
			if(SERVICE_LOGGING || WEB_LOGGING){
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
			
			//Is it a Cache Call
			if(action.cached){
				//Cache It!
				addCachedWebCall(action.url, action.params, resp);
			}
			
			sendResponse(resp);
		});
		
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
}


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
	/*var urlparams = Object.keys(jsonparams)
	  .filter(function (key) {
		console.log("FILTER KEY = "+key+" VALUE = "+jsonparams[key]);
		return jsonparams[key] ? true : false
	  })
	  .map(function (key) {
		console.log("MAP KEY = "+key+" VALUE = "+jsonparams[key]);
	    return encodeURIComponent(key) + '=' + encodeURIComponent(jsonparams[key])
	  })
	  .join('&');*/
	
	  var urlparams = Object.keys(jsonparams)
	  	  .filter(function (key) {
	  		//console.log("FILTER KEY = "+key+" VALUE = "+jsonparams[key]);
	  		return true;
	  	  })
	  	  .map(function (key) {
	  		//console.log("MAP KEY = "+key+" VALUE = "+jsonparams[key]);
	  	    return encodeURIComponent(key) + '=' + encodeURIComponent(jsonparams[key])
	  	  })
	  	  .join('&');
	    
	//console.log("URLPARAMS = "+urlparams);
	  
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
			resp.error 		= "Could not contact Host : "+MINIMASK_MEG_HOST+"\n\nStatus :  "+response.status;
			
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
 * Save / Load User data - Currently NOT used as need to encrypt for Session storage
 */
/*function storeUserDetails(data, callback){
	chrome.storage.session.set({ user_details : data }).then(() => {
		callback();  
	});
}

function retrieveUserDetails(callback){
	chrome.storage.session.get(["user_details"]).then((result) => {
	  	callback(result);
	});
}*/

/**
 * Store Custom MEG details 
 */
function storeCustomMEGDetails(data, callback){
	chrome.storage.local.set({ custom_meg : data }).then(() => {
		callback();  
	});
}

function retrieveCustomMEGDetails(callback){
	chrome.storage.local.get(["custom_meg"]).then((res) => {
		
		//Is there one..
		if(res.custom_meg == undefined){
			res.custom_meg					= {};
			res.custom_meg.enable 			= false;
			res.custom_meg.meg_host 		= "";
			res.custom_meg.meg_user 		= "";
			res.custom_meg.meg_password 	= "";
		}
		
	  	callback(res);
	});
}

function setupMEGConnectDetails(callback){
	
	retrieveCustomMEGDetails(function(res){
		
		//Are they enabled..
		if(!res.custom_meg.enable){
			//Default Details
			MINIMASK_MEG_HOST 			= DEFAULT_MINIMASK_MEG_HOST;
			MINIMASK_MEG_USER 			= DEFAULT_MINIMASK_MEG_USER;
			MINIMASK_MEG_PASSWORD 		= DEFAULT_MINIMASK_MEG_PASSWORD;
		
		}else{
			MINIMASK_MEG_HOST 			= res.custom_meg.meg_host;
			MINIMASK_MEG_USER 			= res.custom_meg.meg_user;
			MINIMASK_MEG_PASSWORD 		= res.custom_meg.meg_password;
		}
		
		console.log("Set Up Meg Details! Host : "+MINIMASK_MEG_HOST);
		
		if(callback){
			callback();
		}
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
	
	//Clear pending..
	PENDING_SENT_MESSAGES = [];
						
	chrome.storage.session.set({ pending_txns : [] }).then((result) => {
		if(callback){
			callback(result);	
		}
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

function removePendingTxn(uid, callback){
	
	//Get the curent list
	getPendingTxns(function(pending){
		
		var newlist = [];
		
		//Remove
		for(var i=0;i<pending.pending_txns.length;i++){
			if(pending.pending_txns[i].pendinguid != uid){
				newlist.push(pending.pending_txns[i]);
			}
		}
		
		//And now set the new list..
		chrome.storage.session.set({ pending_txns : newlist }).then(() => {
			if(callback){
				callback(newlist);	
			}
		});	
	});	
}

/**
 * POLL Messages
 */
var PENDING_SENT_MESSAGES = [];

function addPendingSentMessage(msg){
	PENDING_SENT_MESSAGES.push(msg);
}

function removePendingSentMessage(uid){
	//Now remove that elemnt
	PENDING_SENT_MESSAGES = PENDING_SENT_MESSAGES.filter(function(pitem) {
	    return pitem.pendingmsg.pendinguid !== uid;
	});
}

/**
 * Cache calls to MEG
 */
var MINIMASK_CACHED_CALLS = [];

function getTimeMilli(){
	//Date as of NOW
	var recdate = new Date();
	return recdate.getTime();	
}

function wipeCachedCalls(){
	MINIMASK_CACHED_CALLS = [];
}

function addCachedWebCall(url, params, response){
	
	//Create a cache object
	var cached 			= {};
	cached.time			= getTimeMilli();
	
	cached.url  		= url;
	cached.params  		= JSON.stringify(params);
	
	cached.response  	= response;
	
	MINIMASK_CACHED_CALLS.push(cached);
	
	if(SERVICE_LOGGING){
		console.log("CACHE ADD url:"+url+" params:"+cached.params+" cache_size:"+MINIMASK_CACHED_CALLS.length);
	}
}

function getCachedWebCall(url, params){
	
	//Current time - to remove elements from cache
	var ctime = getTimeMilli();
	
	//Did we find it..
	var foundcache = null;
	
	//The NEW Cache array
	var NEW_CACHE = [];
	
	//What to look for..
	var paramstr = JSON.stringify(params);
	
	//Check all the cached objects
	var len 	= MINIMASK_CACHED_CALLS.length;
	var found 	= false;
	for(var i=0;i<len;i++){
		var cached = MINIMASK_CACHED_CALLS[i];
		
		//Is it within the cache time
		var validtime = (cached.time + 60000 > ctime)
		
		//Check it..
		if(validtime && (cached.url == url) && (cached.params == paramstr)){
			if(SERVICE_LOGGING){
				console.log("CACHE FOUND url:"+url+" params:"+paramstr);
			}
			foundcache = cached;
		}
		
		//Do we keep this cache entry - 1 minute
		if(validtime){
			NEW_CACHE.push(cached);
		}
	}
	
	//Now swich them..
	MINIMASK_CACHED_CALLS = NEW_CACHE; 
	
	if(SERVICE_LOGGING){
		console.log("CACHE Check url:"+url+" params:"+paramstr+" found:"+foundcache+" cache_size:"+MINIMASK_CACHED_CALLS.length);
	}
	
	//And return what we found..
	return foundcache;
}

/**
 * Utility Funcions
 */
function getRandomHexString() {
    const hex = '0123456789ABCDEF';
    let output = '';
    for (let i = 0; i < 24; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return "0x"+output;
}