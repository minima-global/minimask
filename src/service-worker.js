// Example of a simple user data object
const user = {
  username: 'demo-user'
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  //if (message === 'get-user-data') {
    sendResponse(user);
  //}
});


/*chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse) {
    	console.log("GOT MESSAGE : "+request);
	
		//sendResponse(makePostRequest());
		
		makePostRequest("https://spartacusrex.com", {}, function(resp){
			sendResponse(resp);
		});		
  	}
);*/

async function makePostRequest(url, params, callback){
	const response = await fetch(url, {
	  method: "POST",
	 // headers: {
	  //    Authorization: `Bearer ${apiKey}`,
	   // },
	  body: JSON.stringify(params),
	  // …
	});
	
	if (!response.ok) {
      
    }

    const result = await response.text();
	
	callback(result) ;
}