
/**
 * Listen for the Extension ID
 */
/*function windowReceiveMessage(evt) {
	console.log("Window rec : "+JSON.stringify(evt.data));
	
	if(evt.data.event == "MINIMASK_EXTENSION_ID"){
		MINIMASK.EXTENSION_ID = evt.data.data;
		console.log("Extension ID set "+MINIMASK.EXTENSION_ID);
		
		//Removce listener as not used anymore..
		window.removeEventListener("message", windowReceiveMessage,false);
	}
}
window.addEventListener("message", windowReceiveMessage, false);
*/

/**
 * Main MinimMask Object for all interaction
 */
var MINIMASK = {

	//Main MEG Host
	mainmeghost : "http://127.0.0.1:8080/",
	
	//Main MEG Host Username
	mainmegusername : "http://127.0.0.1:8080/",
	
	//Main MEG Host
	mainmeghost : "http://127.0.0.1:8080/",
			
	/**
	 * MINIMASK Startup
	 */
	init : function(callback){
		
		//Log a little..
		console.log("Initialising MiniMask..");
		
		//Is logging enabled.. via the URL
		callback(createMiniMessage("MINIMASK_INIT"));
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

function createMiniMessage(evt){
	return createMiniMessage(evt,{});
}

function createMiniMessage(evt, data){
	
	//Create the message
	var msg 	= {};
	msg.event 	= evt;
	msg.data 	= data;
	
	return msg;
}

/*function sendExtensionMessage(msg, callback){
	chrome.runtime.sendMessage(MINIMASK.EXTENSION_ID,msg,
      	function(response) {
        	callback(response); 
    	}
	);
}

//Test function
function testerFunction(){
	console.log("Running tester function injected code..!");
}*/
