//Add click to buttons
getElement('id_btn_restorewallet').addEventListener('click', function(e) {
	
	//Get the details..
	var seed = id_seed_txt.value.trim();
	
	if(seed == ""){
		alert("Cannot have a blank seed");
		return;
	}
	
	//Show PopUp
	getElement("generate_wait").style.display="block";
	
	//First restore the wallet..
	var msg 				= _createSimpleMessage("account_generate");
	msg.params.seedphrase 	= seed;
	
	chrome.runtime.sendMessage(msg, (resp) => {
		getElement("generate_wait").style.display="none";
		
		if(!resp.status){
			alert("Error : "+resp.error);
			return;
		}else{
			jumpToPage("wallet.html");
		}
	});
});

getElement('id_btn_cancelwallet').addEventListener('click', function(e) {
	jumpToPage("index.html");
});
