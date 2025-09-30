/**
 * Listen for messages
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  	//console.log("Service Worker : "+JSON.stringify(request));
	makePostRequest(request.url,request.params, function(res){
		//console.log("Post Response : "+JSON.stringify(res));
		sendResponse(res);
	});
 
	return true;
});

/**
 * Make a POST request to MEG
 */
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
