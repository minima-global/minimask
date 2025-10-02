
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

function getTokens(){
	//Send a message to Service-Worker
	chrome.runtime.sendMessage(_createSimpleMessage("account_balance"), (resp) => {
		setTokens(resp);
	});
}

//Set the balance
getTokens();

//Add click to button
addButtonOnClick('id_btn_send', function(e) {
	
	//Token
	var sel 	= getElement("select_token");
	var tokenid	= sel.value;
	var text 	= sel.options[sel.selectedIndex].text;
	
	//Amount
	var amount    = getElement("send_amount").value.trim();
	var address   = getElement("send_address").value.trim();
	
	if(amount == "" || address==""){
		alert("You MUST specify a valid amount and address");
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
	
	chrome.runtime.sendMessage(msg, (resp) => {
		getElement("send_wait").style.display="none";
		
		if(!resp.status){
			alert("Error : "+resp.error);
			return;
		}else{
			alert("Funds sent!");
			
			jumpToPage("balance.html");
		}
	});
});
