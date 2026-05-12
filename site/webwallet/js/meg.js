
/**
 * Make a POST request to MEG
 */
async function makePostRequest(command, jsonparams, callback){
	
	//The complete URL
	var url = MINIMASK_HOST+command;
	
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