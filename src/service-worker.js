/**
 * MEG Host details
 */
MINIMASK_MEG_HOST 		= "http://127.0.0.1:8080/";
MINIMASK_MEG_USER 		= "apicaller";
MINIMASK_MEG_PASSWORD 	= "apicaller";

// Example of a simple user data object
const user = {
  username: 'demo-user'
};

function servicelog(str){
	console.log("service.js > "+str);
}

/**
 * Listen for messages
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  	servicelog(JSON.stringify(request));
	
	makePostRequest("http://127.0.0.1:8080/wallet/block",{}, function(res){
		console.log("Post Response : "+JSON.stringify(res));
	
		sendResponse(res);
	});
 
	return true;
});

async function makePostRequest(url, params, callback){
		
	let headers = new Headers();
	headers.append('Authorization', 'Basic ' + btoa("apicaller:apicaller"));
	
	const response = await fetch(url, {
	  method: "POST",
	  headers: headers,
	  body: JSON.stringify(params),
	  // …
	});
	
	if (!response.ok) {
      
    }

	//Wait for the response
    //const result = await response.text();
	const result = await response.json();
	
	//Send result back
	callback(result) ;
}
