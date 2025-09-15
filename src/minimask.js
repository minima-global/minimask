
/**
 * Listen for ther Extension ID
 */
function windowReceiveMessage(evt) {
	console.log("Window rec : "+JSON.stringify(evt.data));
	
	if(evt.data.event == "MINIMASK_EXTENSION_ID"){
		MINIMASK.EXTENSION_ID = evt.data.data;
		console.log("Extension ID set "+MINIMASK.EXTENSION_ID);
		
		//Removce listener as not used anymore..
		window.removeEventListener("message", windowReceiveMessage,false);
	}
}
window.addEventListener("message", windowReceiveMessage, false);

/**
 * Main MinimMask Object for all interaction
 */
var MINIMASK = {

	EXTENSION_ID : "",
	
	//Main MEG Host
	mainhost : "http://127.0.0.1:10005/",
	
	/**
	 * MINIMASK Startup
	 */
	init : function(){
		
		//Log a little..
		console.log("Initialising MiniMask..");
		
		//Is logging enabled.. via the URL
		
	},
	
	/**
	 * Call the MEG functions
	 */
	meg : {
		
		block : function(callback){
			
			var msg 		= {};
			msg.request 	= "block";
			
			//Send via POST
			sendExtensionMessage(msg, callback);	
		},
	}
}

function minimaskHttpPostAsync(theUrl, params, callback){
	//Do we log it..
	console.log("POST_RPC:"+theUrl+" PARAMS:"+params);
	
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        
		console.log("State:"+xmlHttp.readyState+" Status:"+xmlHttp.status);
		
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			//Do we log it..
        	console.log("RESPONSE:"+xmlHttp.responseText);
        	
        	//Send it to the callback function..
        	if(callback){
        		callback(JSON.parsende(xmlHttp.responseText));
        	}
        }
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
	xmlHttp.overrideMimeType('text/plain; charset=UTF-8');
    //xmlHttp.setRequestHeader('Content-Type', 'application/json');    
	xmlHttp.send(encodeURIComponent(params));
	//xmlHttp.send(params);
}

function sendExtensionMessage(msg, callback){
	chrome.runtime.sendMessage(MINIMASK.EXTENSION_ID,msg,
      	function(response) {
        	callback(response); 
    	}
	);
}

//Test function
function testerFunction(){
	console.log("Running tester function injected code..!");
}
