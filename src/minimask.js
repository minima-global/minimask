
/**
 * Main MinimMask Object for all interaction
 */
var MINIMASK = {

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
	 * Set the MiniMask MEG Host
	 */
	setMegHost : function(host){
		mainhost = host;
	},
	
	/**
	 * Account functionality
	 */
	account : {
		
		//Get the Users Public key
		getPublicKey : function(){
			return "0x00";
		}
	},
	
	/**
	 * Call the MEG functions
	 */
	meg : {
		
		block : function(callback){
			//Send via POST
			minimaskHttpPostAsync(MINIMASK.mainhost, "block", callback);	
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
        		callback(JSON.parse(xmlHttp.responseText));
        	}
        }
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
	xmlHttp.overrideMimeType('text/plain; charset=UTF-8');
    //xmlHttp.setRequestHeader('Content-Type', 'application/json');    
	xmlHttp.send(encodeURIComponent(params));
	//xmlHttp.send(params);
}

//Test function
function testerFunction(){
	console.log("Running tester function injected code..!");
}
