//Add click to buttons
getElement('id_btn_restorewallet').addEventListener('click', function(e) {
	
	//Show PopUp
	getElement("generate_wait").style.display="block";
	
	//Get the details..
	var seed = id_seed_txt.value.trim();
	var keys = id_keys_txt.value.trim();
	
	//First restore the wallet..
	var msg 				= _createSimpleMessage("account_generate");
	msg.params.seedphrase 	= "CLICK FEW LIKE OSTRICH LAUGH MEMORY GENIUS ENTIRE TRACK CHEAP SKULL TRIM DAMP MAMMAL NOMINEE MODIFY JUST HOVER ASPECT WAGE TOWN TASTE WHIP NATURE";
	
	chrome.runtime.sendMessage(msg, (resp) => {
		getElement("generate_wait").style.display="none";
		
		if(!resp.status){
			alert("Error : "+resp.error);
			return;
		}else{
			
			//Set the keyuses..
			var setkeys 			= _createSimpleMessage("account_set_key_uses");
			setkeys.params.amount 	= keys;
			
			chrome.runtime.sendMessage(setkeys, (resp) => {
				//And now..
				jumpToPage("wallet.html");	
			});
		}
	});
});

getElement('id_btn_cancelwallet').addEventListener('click', function(e) {
	jumpToPage("index.html");
});
