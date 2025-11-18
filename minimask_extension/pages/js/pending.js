/**
 * JS function for pending.html
 */

var PENDING_LIST = [];

function getPendingItem(uid){
	for(var i=0;i<PENDING_LIST.length;i++){
		if(PENDING_LIST[i].pendinguid == uid){
			return PENDING_LIST[i];
		}
	}
	
	return null;
}
		
function acceptPending(uid, callback){
	
	//Get that value..
	var pending = getPendingItem(uid)
		
	//is it a SEND or a SIGN
	if(pending.command == "account_send"){
		sendAction(uid, callback);
	}else if(pending.command == "account_sign"){
		signAction(uid, callback);
	}
}

function sendAction(uid, callback){
	
	//Get that value..
	var pending = getPendingItem(uid)
		
	//Send this amount..
	var msg 			= _createSimpleMessage("account_send");
	
	msg.params.amount 	= pending.params.amount;
	msg.params.address	= pending.params.toaddress;
	msg.params.tokenid 	= pending.params.tokenid;
	msg.params.state 	= pending.params.state;
	
	//And get the latest key uses
	callSimpleServiceWorker("account_get_key_uses", function(res){
		msg.params.keyuses = res.data;
		
		//And send on..
		chrome.runtime.sendMessage(msg, (sendresp) => {
			
			pendingSent(pending, sendresp, function(){
			
				popupAlert("Funds Sent!");
								
				//Remove from list..
				cancelPending(uid);	
			});
		});
	});
}

function signAction(uid, callback){
	
	//Get that value..
	var pending = getPendingItem(uid)
		
	//Send this amount..
	var msg 			= _createSimpleMessage("account_sign");
	msg.params.data 	= pending.params.data;
	msg.params.post 	= pending.params.post;
	
	//And get the latest key uses
	callSimpleServiceWorker("account_get_key_uses", function(res){
		msg.params.keyuses = res.data;
		
		//And send on..
		chrome.runtime.sendMessage(msg, (sendresp) => {
			
			pendingSent(pending, sendresp, function(){
			
				if(pending.params.post){
					popupAlert("Transaction Signed and Posted!");	
				}else{
					popupAlert("Transaction Signed!");
				}
						
				//Remove from list..
				cancelPending(uid);	
			});
		});
	});
}

function pendingSent(pending, resp, callback){
	
	//Now tell service this message sent
	var msg 		= _createSimpleMessage("account_sent_pending");
	msg.pendingmsg 	= pending;
	msg.pendingresp	= resp;
	
	//Add..
	chrome.runtime.sendMessage(msg, (resp) => {
		if(callback){
			callback();	
		}
	});
}

function cancelPending(uid, callback){
	var msg 				= _createSimpleMessage("account_remove_pending");
	msg.params.removeid  	= uid;
	
	chrome.runtime.sendMessage(msg, (resp) => {
		
		//Now reload..
		loadPending(function(){
			if(callback){
				callback();
			}
		});
	});			
}

function setPendingList(callback){
	
	var total = "";
	
	if(PENDING_LIST.length == 0){
		total = "No pending transactions..";
	}
	
	for(var i=0;i<PENDING_LIST.length;i++){
	
		var pending = PENDING_LIST[i];
		
		if(pending.command == "account_send"){
			var comm = '<table width=100%>'+
											
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>Type : </td>'+
							'<td style="font-size:10;" nowrap>Send coins from account</td>'+
						'</tr>'+
									
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>From : </td>'+
							'<td style="font-size:10;" nowrap>'+sanitizeHTML(shrinkAddress(pending.sender.url))+'</td>'+
						'</tr>'+
											
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>Token : </td>'+
							'<td style="width:100%">'+sanitizeHTML(shrinkAddress(pending.params.tokenid))+'</td>'+
						'</tr>'+
						
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>Amount : </td>'+
							'<td>'+sanitizeHTML(shrinkAddress(""+pending.params.amount))+'</td>'+
						'</tr>'+
						
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>Address : </td>'+
							'<td nowrap>'+
								'<div style="font-size:10;">'+sanitizeHTML(shrinkAddress(pending.params.toaddress))+'</div>'+
							'</td>'+
						'</tr>'+
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>State : </td>'+
							'<td nowrap>'+
								'<div style="font-size:10;">'+sanitizeHTML(shrinkAddress(pending.params.state))+'</div>'+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td colspan=2 style="text-align:right;" nowrap>'+
								'<button class="mybtn" id="id_btn_cancel_'+i+'">Cancel</button>&nbsp;'
							   +'<button class="mybtn" id="id_btn_accept_'+i+'">Accept</button>'+
							'</td>'+
						'</tr>'+
					'</table>';	
			
		}else if(pending.command == "account_sign"){
			
			//Are we posting
			var title = "Sign transaction";
			if(pending.params.post){
				title = "Sign and Post transaction";
			}
			
			var comm = '<table width=100%>'+
														
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>Type : </td>'+
							'<td style="font-size:10;" nowrap>'+title+'</td>'+
						'</tr>'+
						
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>UID : </td>'+
							'<td style="font-size:10;" nowrap>'+pending.pendinguid+'</td>'+
						'</tr>'+
									
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>From : </td>'+
							'<td style="font-size:10;" nowrap>'+sanitizeHTML(shrinkAddress(pending.sender.url))+'</td>'+
						'</tr>'+
											
						'<tr style="background-color: #eeeeee;">'+
							'<td style="text-align:right" nowrap>Transaction : </td>'+
							'<td style="width:100%"><a href="transaction.html?pendinguid='+pending.pendinguid+'">View Transaction</a></td>'+
						'</tr>'+
						
						'<tr>'+
							'<td colspan=2 style="text-align:right;" nowrap>'+
								'<button class="mybtn" id="id_btn_cancel_'+i+'">Cancel</button>&nbsp;'
							   +'<button class="mybtn" id="id_btn_accept_'+i+'">Accept</button>'+
							'</td>'+
						'</tr>'+
					'</table>';
				
		}
		
		total += comm+"<br>";
	}
	
	//Set this as the view
	id_pending_list.innerHTML = total;
	
	//Now add event Listeners
	for(var i=0;i<PENDING_LIST.length;i++){
		
		var puid = PENDING_LIST[i].pendinguid;
		
		//Accept
		addButtonOnClickWithParams("id_btn_accept_"+i, acceptPending, puid);
		addButtonOnClickWithParams("id_btn_cancel_"+i, cancelPending, puid);
	} 
	
	//All done..
	if(callback){
		callback();
	}
}

function loadPending(callback){
	
	//Send a message to Service-Worker
	callSimpleServiceWorker("account_pending", (resp) => {
		
		//Store this
		PENDING_LIST = resp.data.pending_txns;
				
		//Set it..
		setPendingList(callback);
	});
}

loadPending();
