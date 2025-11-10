
function setTokens(resp){
	
	var sel = getElement("select_token");
	for(var i=0;i<resp.data.length;i++){
		var balance = resp.data[i];
		
		var option = document.createElement("option");
	    option.value = balance.tokenid;
	    
		if(balance.tokenid == "0x00"){
			option.text  = "Minima";	
		}else{
			option.text  = balance.token.name;
		}
		
	    sel.appendChild(option);
	}
}

var VALID_TOKEN = true;
function getTokens(){
	//Send a message to Service-Worker
	callSimpleServiceWorker("account_balance", (resp) => {
		if(!resp.status){
			VALID_TOKEN = false;
			popupAlert(resp.error);
		}else{
			setTokens(resp);	
		}
	});
}

//Set the balance
getTokens();

//Set the Key Uses
callSimpleServiceWorker("account_get_key_uses", function(res){
	send_keyuses.value = res.data;
});

//Add click to button
addButtonOnClick('id_btn_send', function(e) {
	
	if(!VALID_TOKEN){
		return;
	}
	
	//Token
	var sel 	= getElement("select_token");
	var tokenid	= sel.value;
	var text 	= sel.options[sel.selectedIndex].text;
	
	//Amount
	var amount    = getElement("send_amount").value.trim();
	var address   = getElement("send_address").value.trim();
	var keyuses   = getElement("send_keyuses").value.trim();
		
	if(amount == "" || address=="" || keyuses==""){
		popupAlert("You MUST specify a valid amount, address and keyuses");
		return;
	}else{
		if(!confirm("Are you sure you wish to proceed ?")){
			return;
		}
	} 
	
	//Show send box..
	getElement("send_wait").style.display="block";
	
	//Send it..
	var msg 			= _createSimpleMessage("account_send");
	
	msg.params.amount 	= amount;
	msg.params.address	= address;
	msg.params.tokenid 	= tokenid;
	msg.params.state 	= "{}";
	
	msg.params.keyuses 	= keyuses;
	
	chrome.runtime.sendMessage(msg, (resp) => {
		getElement("send_wait").style.display="none";
		
		if(!resp.status){
			popupAlert(resp.error);
			return;
		}else{
			popupAlert("Funds sent!\n\nPlease wait for transaction to confirm..");
			
			jumpToPage("balance.html");
		}
	});
});

