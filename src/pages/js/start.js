

//Send it..
callSimpleServiceWorker("minimask_extension_init", (resp) => {
	
	if(resp.data.loggedon){
		jumpToPage("wallet.html");
	}else{
		jumpToPage("index.html");
	}
});