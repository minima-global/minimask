
function checkPending(){
	
	//Are there any pending..
	callSimpleServiceWorker("account_pending", (resp) => {
			
		//Store this
		if(resp.data.pending_txns.length > 0){
			getElement("id_pending_reddot").style.display="block";
		}else{
			getElement("id_pending_reddot").style.display="none";
		}
	});
}

//Check at startup..
checkPending();

//Add click to buttons
addButtonOnClick('id_wallet_balance', function(e) {
	checkPending();
	
	getElement("mainiframe").src="./balance.html";
});

addButtonOnClick('id_wallet_send', function(e) {
	checkPending();
		
	getElement("mainiframe").src="./send.html";
});

addButtonOnClick('id_wallet_receive', function(e) {
	checkPending();
		
	getElement("mainiframe").src="./receive.html";
});

addButtonOnClick('id_img_settings', function(e) {
	checkPending();
		
	getElement("mainiframe").src="./settings.html";
});

addButtonOnClick('id_img_pending', function(e) {
	checkPending();
		
	getElement("mainiframe").src="./pending.html";
});

addButtonOnClick('id_img_logout', function(e) {
	checkPending();
	
	//Get Key Uses..	
	callSimpleServiceWorker("account_get_key_uses", function(res){
	
		if(confirm("Are you sure you wish to Logout ?\n\nCurrent key uses : "+res.data)){
			//Logout..
			callSimpleServiceWorker("minimask_extension_logout", (resp) => {
				window.top.location.href = "./start.html";
			});
		}
	});
});
