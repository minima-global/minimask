/**
 * JS function for pending.html
 */

var PENDING_LIST = [];
		
function acceptPending(id, callback){
	
	//Get that vakue..
	var pending = PENDING_LIST[id];
	
	//Send this amount..
	//..
	
	//Remove from list..
	cancelPending(id);
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
	if(strlen > 16){
		return addr.substring(0,16)+" .. "+addr.substring(strlen-16,strlen);
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
					'<td style="text-align:right" nowrap>Token : </td>'+
					'<td style="width:100%">'+pending.params.tokenid+'</td>'+
				'</tr>'+
				
				'<tr style="background-color: #eeeeee;">'+
					'<td style="text-align:right" nowrap>Amount : </td>'+
					'<td>'+pending.params.amount+'</td>'+
				'</tr>'+
				
				'<tr style="background-color: #eeeeee;">'+
					'<td style="text-align:right" nowrap>Address : </td>'+
					'<td>'+
						'<div style="overflow-wrap: break-word;font-size:10;">'+shrinkAddress(pending.params.toaddress)+'</div>'+
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
	chrome.runtime.sendMessage(_createSimpleMessage("account_pending"), (resp) => {
		
		//Store this
		PENDING_LIST = resp.data.pending_txns;
				
		//Set it..
		setPendingList(PENDING_LIST, callback);
	});
}

loadPending();
