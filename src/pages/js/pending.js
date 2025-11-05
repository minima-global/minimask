/**
 * JS function for pending.html
 */

var PENDING_LIST = [];
		
function acceptPending(id, callback){
	
	//Get that vakue..
	var pending = PENDING_LIST[id];
	
	//Send this amount..
	var msg 			= _createSimpleMessage("account_send");
	
	//Sent internally.. no pending
	msg.external 		= false;
	
	msg.params.amount 	= pending.params.amount;
	msg.params.address	= pending.params.toaddress;
	msg.params.tokenid 	= pending.params.tokenid;
	msg.params.state 	= pending.params.state;
	
	//And get the latest key uses
	callSimpleServiceWorker("account_get_key_uses", function(res){
		msg.params.keyuses = res.data;
		
		//And send on..
		chrome.runtime.sendMessage(msg, (resp) => {
			alert("Funds Sent!");
			
			//Remove from list..
			cancelPending(id);
		});
	});
}

function cancelPending(id, callback){
	var msg 				= _createSimpleMessage("account_remove_pending");
	msg.params.removeid  	= id;
	
	chrome.runtime.sendMessage(msg, (resp) => {
		
		//Now reload..
		loadPending(function(){
			if(callback){
				callback();
			}
		});
	});			
}

function shrinkAddress(addr){
	var strlen = addr.length;
	if(strlen > 24){
		return addr.substring(0,24)+" .. "+addr.substring(strlen-12,strlen);
	}
	
	return addr;
}

function setPendingList(pendinglist, callback){
	
	var total = "";
	
	if(pendinglist.length == 0){
		total = "No pending transactions..";
	}
	
	for(var i=0;i<pendinglist.length;i++){
	
		var pending = pendinglist[i];
		
		var comm = '<table width=100%>'+
								
			'<tr style="background-color: #eeeeee;">'+
				'<td style="text-align:right" nowrap>From : </td>'+
				'<td style="font-size:10;" nowrap>'+sanitizeHTML(shrinkAddress(pending.sender.url))+'</td>'+
			'</tr>'+
								
			'<tr style="background-color: #eeeeee;">'+
				'<td style="text-align:right" nowrap>Token : </td>'+
				'<td style="width:100%">'+sanitizeHTML(pending.params.tokenid)+'</td>'+
			'</tr>'+
			
			'<tr style="background-color: #eeeeee;">'+
				'<td style="text-align:right" nowrap>Amount : </td>'+
				'<td>'+sanitizeHTML(pending.params.amount)+'</td>'+
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
		
		total += comm+"<br>";
	}
	
	//Set this as the view
	id_pending_list.innerHTML = total;
	
	//Now add event Listeners
	for(var i=0;i<pendinglist.length;i++){
		
		//Accept
		addButtonOnClickWithParams("id_btn_accept_"+i, acceptPending, i);
		addButtonOnClickWithParams("id_btn_cancel_"+i, cancelPending, i);
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
		setPendingList(PENDING_LIST, callback);
	});
}

loadPending();
