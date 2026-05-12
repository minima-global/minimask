
function setKeyUses(){
	id_wallet_send_keyuses.value = 	USER_KEYUSES;
}

function setLocalKeyUses(){
	
	//Store to local storage
	localStorage.setItem("KEY_USES_"+USER_ADDRESS, USER_KEYUSES);
}

function getLocalKeyUses(){
	
	//Get Local Key Uses
	var keyuses = localStorage.getItem("KEY_USES_"+USER_ADDRESS);
			
	//Check Exists
	if(keyuses == null){
		USER_KEYUSES = 0;
	}else{
		USER_KEYUSES = keyuses;
	}
}

function wallet_sendfunds(){
	
	var sel = id_wallet_tokenselect.selectedIndex;
		
	//Get the details..
	var tokenname 	= id_wallet_tokenselect.options[sel].text;
	var tokenid 	= id_wallet_tokenselect.value;
	var address 	= id_wallet_send_address.value.trim();
	var amount  	= id_wallet_send_amount.value;
	var keyuses 	= id_wallet_send_keyuses.value;
	var split		= id_wallet_send_split.checked;
	
	//Confirm..
	if(!confirm("You are about to send "+amount+" "+tokenname+" to "+address)){
		return;
	}
	
	id_wallet_send_address.value	= "";
	id_wallet_send_amount.value		= 0;
	id_wallet_send_split.checked	= false
	
	//INCREMENT!
	USER_KEYUSES = (+keyuses)+1;
	
	//Store this
	setLocalKeyUses();
	
	//Set in GUI
	setKeyUses();
	
	//Disable the button
	id_wallet_sendbutton.disabled=true;
	
	var params 			= {};
	params.amount		= amount;
	params.tokenid		= tokenid;
	params.toaddress	= address;
	params.fromaddress	= USER_ADDRESS;
	params.privatekey	= USER_PRIVATE_KEY;
	params.script		= USER_SCRIPT;
	params.keyuses		= USER_KEYUSES;
	params.mine			= false;
	
	if(split){
		params.split	= 5;
	}
			
	makePostRequest("send", params, function(resp){
		console.log(JSON.stringify(resp));
		
		if(resp.status){
			alert("Funds Sent!");
		}else{
			alert(resp.error);
		}
		
		id_wallet_sendbutton.disabled=false;
	});
		
}