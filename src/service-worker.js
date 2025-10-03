/**
 * MEG Host details
 */
MINIMASK_MEG_HOST 			= "http://127.0.0.1:8080/";
MINIMASK_MEG_USER 			= "apicaller";
MINIMASK_MEG_PASSWORD 		= "apicaller";

var MINIMASK_USER_DETAILS 	= {};
//MINIMASK_ACCOUNT_ADDRESS 	= "MxG085TPR16EJF558GCVUW8F985D1J4CU1CDCRQAG9MVTT00G76E0QCJ8H4BEH5";
//MINIMASK_ACCOUNT_PUBLICKEY 	= "0x276F7F3D948B2BCF82AE07E41E45FF31CE4B825F624D4FA61B4D010323150597";
//MINIMASK_ACCOUNT_PRIVATEKEY	= "0x0EC144D5CC79FF1DA66CE0C1046A9F7AE35579234CE1A4F3C04CC1B103D2D32E";
//MINIMASK_ACCOUNT_SCRIPT 	= "RETURN SIGNEDBY(0x276F7F3D948B2BCF82AE07E41E45FF31CE4B825F624D4FA61B4D010323150597)";

MINIMASK_USER_DETAILS.LOGGEDON						= false;
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS 		= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY 	= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY	= "";
MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_SCRIPT 		= "";

var SERVICE_LOGGING = false;

/**
 * Load the 
 */

/**
 * Convert Command to actual function
 */
function convertMessageToAction(msg){

	var ret 		= {};
	
	ret.webcall 	= false;
	ret.internal 	= false;
	ret.url 		= "";
	ret.params 		= {};
	ret.response	= {};
	
	//WEBCALL functions
	if(msg.command ==  "create"){
		ret.webcall = true;
		ret.url 	= MINIMASK_MEG_HOST+"wallet/create";
	
	}else if(msg.command ==  "block"){
		ret.webcall = true;
		ret.url 	= MINIMASK_MEG_HOST+"wallet/block";
	
	}else if(msg.command ==  "random"){
		ret.webcall = true;
		ret.url 	= MINIMASK_MEG_HOST+"wallet/random";
	
	}else if(msg.command ==  "account_balance"){
		ret.webcall 		= true;
		ret.url 			= MINIMASK_MEG_HOST+"wallet/balance";
		
		ret.params.address 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;

	}else if(msg.command ==  "account_send"){
			ret.webcall 			= true;
			ret.url 				= MINIMASK_MEG_HOST+"wallet/send";
			
			ret.params.amount 		= msg.params.amount;
			ret.params.toaddress 	= msg.params.address;
			ret.params.tokenid 		= msg.params.tokenid;
			ret.params.fromaddress 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;
			ret.params.publickey 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY;
			ret.params.privatekey 	= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PRIVATEKEY;
			ret.params.script 		= MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_SCRIPT;				
						
	//NOT WEB CALLS
	}else if(msg.command ==  "account_getaddress"){
		ret.status 		 = true;
		ret.response.address = MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_ADDRESS;
	
	}else if(msg.command ==  "account_getpublickey"){
		ret.status 		 = true;
		ret.response.publickey = MINIMASK_USER_DETAILS.MINIMASK_ACCOUNT_PUBLICKEY;
			
	//INTERNAL Messages
	}else if(msg.command ==  "account_generate"){
		ret.internal 			= true;	
		ret.url 				= MINIMASK_USER_DETAILS.MINIMASK_MEG_HOST+"wallet/seedphrase";
		ret.params.seedphrase 	= msg.params.seedphrase;
								
	}else if(msg.command ==  "minimask_extension_init"){
		ret.internal 		= true;	
	
	}else if(msg.command ==  "minimask_extension_logout"){
		ret.internal 		= true;	
					
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
  	if(SERVICE_LOGGING){
		console.log("Service Worker Received Command : "+JSON.stringify(request));	
	}
	
	console.log("SENDER : "+JSON.stringify(sender));
	
	//Convert to a function
	var action = convertMessageToAction(request);
	
	if(SERVICE_LOGGING){
		console.log("Service Worker Converted Command : "+JSON.stringify(action));
	}
		
	//Is it a webcall..
	if(action.internal){
		
		var resp 	= {};
		resp.status = true;
					
		if(request.command == "account_generate"){
			
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
			
			return true;
				
		}else if(request.command == "minimask_extension_init"){
			
			console.log("Try Logon..");
			
			//Are we logged in..
			retrieveUserDetails(function(details){
				console.log("INIT : "+JSON.stringify(details));
				
				resp.data 			= {};
				resp.data.loggedon 	= false;
				
				if(details.user_details){
					if(details.user_details.LOGGEDON){
						resp.data.loggedon 	= true;
											
						//Set the details..
						MINIMASK_USER_DETAILS = details.user_details;	
					}
				}
				
				sendResponse(resp);				
			});
			
			return true;
		
		}else if(request.command == "minimask_extension_logout"){
			
			
			storeUserDetails({}, function(){
				retrieveUserDetails(function(details){
					console.log("AFTER LOGOUT : "+JSON.stringify(details));
				
					sendResponse(resp);
				});		
			});	
			
			return true;
		}
		
	}else if(action.webcall){
		
		//Call MEG
		makePostRequest(action.url, action.params, function(res){
			if(SERVICE_LOGGING){
				console.log("Post Response : "+JSON.stringify(res));
			}
			
			//ONLY send back the response
			var resp 	= {};
			resp.status = res.status;
			
			//Success or fail
			if(!resp.status){
				resp.error = res.error;
			}else{
				resp.data	= res.response;	
			}
			
			sendResponse(resp);
		});
		
		return true;	
	}else{
		//ONLY send back the response
		var resp 	= {};
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


