

//Send it..
chrome.runtime.sendMessage(_createSimpleMessage("minimask_extension_init"), (resp) => {
	
	if(resp.data.loggedon){
		console.log("User logged in!");
		
		jumpToPage("wallet.html");
	}else{
		console.log("No User logged in!");
		
		jumpToPage("index.html");
	}
});