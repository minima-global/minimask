/**
 * MEG Host details
 */
MINIMASK_MEG_HOST 			= "http://127.0.0.1:8080/";
MINIMASK_MEG_USER 			= "apicaller";
MINIMASK_MEG_PASSWORD 		= "apicaller";

MINIMASK_ACCOUNT_ADDRESS 	= "MxG085TPR16EJF558GCVUW8F985D1J4CU1CDCRQAG9MVTT00G76E0QCJ8H4BEH5";
MINIMASK_ACCOUNT_PUBLICKEY 	= "0x276F7F3D948B2BCF82AE07E41E45FF31CE4B825F624D4FA61B4D010323150597";

/**
 * Convert Command to actual function
 */
function convertMessageToAction(msg){

	var ret 	= {};
	
	ret.webcall = false;
	ret.url 	= "";
	ret.params 	= {};
	ret.data	= {};
	
	if(msg.command ==  "create"){
		ret.webcall = true;
		ret.url 	= MINIMASK_MEG_HOST+"wallet/create";
	
	}else if(msg.command ==  "block"){
		ret.webcall = true;
		ret.url 	= MINIMASK_MEG_HOST+"wallet/block";
	
	}else if(msg.command ==  "account_balance"){
			ret.webcall 		= true;
			ret.url 			= MINIMASK_MEG_HOST+"wallet/balance";
			ret.params.address 	= MINIMASK_ACCOUNT_ADDRESS;
			
	//NOT WEB CALLS
	}else if(msg.command ==  "account_getaddress"){
		ret.data.address = MINIMASK_ACCOUNT_ADDRESS;
	
	}else if(msg.command ==  "account_getpublickey"){
		ret.data.publickey = MINIMASK_ACCOUNT_PUBLICKEY;
			
	}else{
		ret.data.error = "Unknown command : "+msg.command;
	}
	
	return ret;	
}

/**
 * Listen for messages
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  	console.log("Service Worker Received Command : "+JSON.stringify(request));
	
	//Convert to a function
	var action = convertMessageToAction(request);
	
	console.log("Service Worker Converted Command : "+JSON.stringify(action));
		
	//Is it a webcall..
	if(action.webcall){
		var userpass = MINIMASK_MEG_USER+":"+MINIMASK_MEG_PASSWORD;
		makePostRequest(action.url, action.params, userpass, function(res){
			console.log("Post Response : "+JSON.stringify(res));
			sendResponse(res);
		});
		
		return true;	
	}else{
		//No webcall required.. just send answer back
		sendResponse(action.data);
	}
});


/**
 * Make a POST request to MEG
 */
async function makePostRequest(url, jsonparams, userpass, callback){
	
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
