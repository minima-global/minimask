
function fetchUserBalance(){
	
	var params 	= {};
	params.address = USER_ADDRESS;
	params.megammr = true;
			
	makePostRequest("balance", params, function(resp){
		//set the table
		updateBalancePanel(resp.response);
	});
}

/**
 * Update the balance
 */
function updateBalancePanel(user_balance){
	
	var baltable 	= document.getElementById('id_balance_table');
	var tokenselect	= document.getElementById('id_wallet_tokenselect');
	
	//Clear Table
	baltable.innerHTML 		= "";
	tokenselect.innerHTML 	= "";
	
	//Set the Headers
	var row   = baltable.insertRow(0);
	row.insertCell().outerHTML = "<th style='text-align:left;'>Token</th>";
	row.insertCell().outerHTML = "<th>Amount</th>";
	row.insertCell().outerHTML = "<th>Coins&nbsp;&nbsp;&nbsp;&nbsp;</th>"; 
		
	//Get my Orders
	var len = user_balance.length;
	for(var i=0;i<len;i++) {
		
		var tokenbal=user_balance[i];
		
		//Insert row
		var row = baltable.insertRow();
		row.style.fontSize 	= "0.8em";
		
		var celltoken 		= row.insertCell();
		var cellamount 		= row.insertCell();
		var cellcoins 		= row.insertCell();
				
		var tokenname = "";
		if(tokenbal.tokenid == "0x00"){
			tokenname = "Minima";
		}else{
			tokenname = tokenbal.token.name;
		}
		
		celltoken.innerText = tokenname;
		celltoken.style.width="100%";
		
		if(tokenbal.unconfirmed != "0"){
			cellamount.innerText 	= tokenbal.confirmed+" ("+tokenbal.unconfirmed+")";
		}else{
			cellamount.innerText 	= tokenbal.confirmed;	
		}
		
		cellcoins.innerText = tokenbal.coins;
		
		//Insert row
		var rowid 				= baltable.insertRow();
		var celltokenid 		= rowid.insertCell();
		celltokenid.colSpan 		= "3";
		celltokenid.style.fontSize 	= "0.5em";
		celltokenid.style.color 	= "grey";
		celltokenid.innerText 	= tokenbal.tokenid;
		
		//Final gap
		var rowgap 	= baltable.insertRow();
		var rowgap 	= rowgap.insertCell();
		rowgap.innerHTML = "&nbsp;";
		
		//And sort the select
		var opt 		= document.createElement('option');
        opt.value 		= tokenbal.tokenid;
        opt.innerText 	= tokenname;
        tokenselect.appendChild(opt);
	}
}



