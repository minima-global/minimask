//Add click to buttons
getElement('id_btn_restorewallet').addEventListener('click', function(e) {
	
	//Show PopUp
	getElement("generate_wait").style.display="block";
	
	//First restore the wallet..
	var msg 				= _createSimpleMessage("account_generate");
	msg.params.seedphrase 	= "CLICK FEW LIKE OSTRICH LAUGH MEMORY GENIUS ENTIRE TRACK CHEAP SKULL TRIM DAMP MAMMAL NOMINEE MODIFY JUST HOVER ASPECT WAGE TOWN TASTE WHIP NATURE";
	
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
