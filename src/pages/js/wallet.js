
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
