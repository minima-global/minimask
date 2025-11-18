

function setTransaction(txndata){
	
	//Get the TXN as a JSON..
	var func = _createSimpleMessage("viewtxn");
	func.params.data 	= txndata;
	
	chrome.runtime.sendMessage(func, (viewresp) => {
		//Now set it!
		if(viewresp.status){
			id_transaction.innerHTML = sanitizeHTML(JSON.stringify(viewresp.data.transaction,null,2));
		}else{
			id_transaction.innerHTML = sanitizeHTML(JSON.stringify(viewresp,null,2));
		}	
	});
}

function load_transaction(){
	
	//Get the PendingUID
	var urlpendinguid =  getURLParameter("pendinguid");
	
	//Get this pending message
	callSimpleServiceWorker("account_pending", (resp) => {
		
		//Store this
		var PENDING_LIST = resp.data.pending_txns;
		
		//Get the correct one..
		for(var i=0;i<PENDING_LIST.length;i++){
			var pending = PENDING_LIST[i];
			
			if(urlpendinguid == pending.pendinguid){
				setTransaction(pending.params.data);
				break;
			}
		}
	});
}

load_transaction();