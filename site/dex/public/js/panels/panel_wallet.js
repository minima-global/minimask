
const seed_blakout_panel	= document.getElementById('id_blackoutdiv');
const seed_show_panel 		= document.getElementById('id_seedphrasepanel');

function walletInit(){
	
	var qrcode = new QRCode("wallet_receiveqr", {
		    text: USER_ACCOUNT.ADDRESS,
		    width: 250,
		    height: 250,
		    colorDark : "#000000",
		    colorLight : "#ffffff",
		    correctLevel : QRCode.CorrectLevel.H
		});	
		
	document.getElementById('id_wallet_address').innerHTML		=USER_ACCOUNT.ADDRESS;
	document.getElementById('id_seedphrasedetails').innerHTML	=USER_ACCOUNT.SEED;
}

function showSeedPhrase(){
	
	//Set key uses..
	id_seedphrase_keyuses.innerHTML		= USER_ACCOUNT.KEYUSES;
	
	seed_blakout_panel.style.display 	= "block";
	seed_show_panel.style.display 		= "block";
}

function hideSeedPhrase(){
	seed_blakout_panel.style.display 	= "none";
	seed_show_panel.style.display 		= "none";
}

function updateBalancePanel(){
	
	var baltable 	= document.getElementById('id_balance_table');
	var tokenselect	= document.getElementById('id_wallet_tokenselect');
	
	//Clear Table
	baltable.innerHTML 		= "";
	tokenselect.innerHTML 	= "";
	
	//Set the Headers
	var row   = baltable.insertRow(0);
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Token</th>";
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Available&nbsp;&nbsp;&nbsp;&nbsp;</th>"; 
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Amount&nbsp;&nbsp;&nbsp;&nbsp;</th>"; 
	row.insertCell().outerHTML = "<th class='smalltableheadertext'>Coins&nbsp;&nbsp;&nbsp;&nbsp;</th>";
		
	//Get my Orders
	var len = USER_BALANCE.length;
	for(var i=0;i<len;i++) {
		
		var tokenbal=USER_BALANCE[i];
		
		//Insert row
		var row = baltable.insertRow();
		row.style.fontSize 	= "0.8em";
		
		var celltoken 		= row.insertCell();
		var cellavailable 	= row.insertCell();
		var cellamount 		= row.insertCell();
		var cellcoins 		= row.insertCell();
		var cellsplt 		= row.insertCell();
		
		var tokenname = "";
		if(tokenbal.tokenid == "0x00"){
			tokenname = "Minima";
		}else{
			tokenname = tokenbal.token.name;
		}
		
		celltoken.innerHTML = tokenname;
		celltoken.style.width="100%";
		
		cellavailable.innerHTML = getAvailableBalance(tokenbal.tokenid);
		
		if(tokenbal.unconfirmed != "0"){
			cellamount.innerHTML 	= tokenbal.confirmed+" ("+tokenbal.unconfirmed+")";
		}else{
			cellamount.innerHTML 	= tokenbal.confirmed;	
		}
		
		cellcoins.innerHTML = tokenbal.coins;
		
		//if(AUTO_BALANCE_ENABLED){
		//	cellsplt.innerHTML 	= "<button class=mybtn onclick='splitWalletCoins(\""+tokenname+"\",\""+tokenbal.tokenid+"\");' disabled>Split Coins</button>";
		//}else{
			cellsplt.innerHTML 	= "<button class=mybtn onclick='splitWalletCoins(\""+tokenname+"\",\""+tokenbal.tokenid+"\");'>Split Coins</button>";	
		//}
		
		
		//Insert row
		var rowid 				= baltable.insertRow();
		var celltokenid 		= rowid.insertCell();
		celltokenid.colSpan 		= "4";
		celltokenid.style.fontSize 	= "0.7em";
		celltokenid.style.color 	= "grey";
		celltokenid.innerHTML 	= tokenbal.tokenid;
		
		//Final gap
		var rowgap 	= baltable.insertRow();
		var rowgap 	= rowgap.insertCell();
		rowgap.innerHTML = "&nbsp;";
		
		//And sort the select
		var opt 		= document.createElement('option');
        opt.value 		= tokenbal.tokenid;
        opt.innerHTML 	= tokenname;
        tokenselect.appendChild(opt); 	
	}
}

/**
 * Send fundxs from the wallet
 */
function wallet_sendfunds(){
	
	var sel = id_wallet_tokenselect.selectedIndex;
	
	//Get the details..
	var tokenname 	= id_wallet_tokenselect.options[sel].text;
	var tokenid 	= id_wallet_tokenselect.value;
	var address 	= id_wallet_send_address.value.trim();
	var amount  	= id_wallet_send_amount.value;
	
	//Get totasl available amount
	var available = getAvailableBalance(tokenid);
	
	if(amount <= 0 || amount>available){
		alert("Invalid amount : "+amount+"\n\nAvailable : "+available);
		return;
	}
	
	if(address == ""){
		alert("Cannot have blank address");
		return;
	}
	
	if(confirm("You are about to send "+amount+" "+tokenname+" to "+address+"\n\nContinue ?")){
		
		//Send
		utility_send(tokenname, tokenid, amount, address, 1, function(resp){
			if(resp.status){
				//Add Log
				addHistoryLog("SEND_COINS","User sends "+amount+" "+tokenname+" to "+address, resp.data.txpowid);
								
				alert("Funds Sent!");
			}else{
				alert(resp.error);
			}
		});
		
		id_wallet_send_amount.value  = 0;
		id_wallet_send_address.value = "";
	}
}

/**
 * Split token coins back into 10
 */
function splitWalletCoins(tokenname, tokenid){
	
	//Get the balance..
	var balance = getConfirmedBalance(tokenid);
			
	if(confirm("This will split your "+tokenname+" coins ("+balance+") into 10 equal amounts."
				+"\n\nWhile the coins are being split your orders will not be available.."
				+"\n\nContinue ?")){
					
		//FOR NOW - set the confirmed to 0..
		setSplitCoinsBalanceZero(tokenid);
								
		//Send and split..
		utility_send(tokenname, tokenid, balance, USER_ACCOUNT.ADDRESS, 10, function(resp){
			if(resp.status){
				//Add Log
				addHistoryLog("SPLIT_COINS","User splits "+tokenname, resp.data.txpowid);	
				
				alert("Funds Split!");
			}else{
				alert(resp.error);
			}	
		});
	}
}

/**
 * Utility SEND function
 */
function utility_send(tokenname, tokenid, amount, address, split, callback){
	//Send
	MINIMASK.meg.send(amount+"", address, tokenid, 
		USER_ACCOUNT.ADDRESS, USER_ACCOUNT.PRIVATEKEY, 
		USER_ACCOUNT.SCRIPT, USER_ACCOUNT.KEYUSES, 
		split, function(resp){
		
		//Update KEY USES
		USER_ACCOUNT.KEYUSES = +USER_ACCOUNT.KEYUSES+1;
		
		//Save data..
		saveUserDetails();
		
		//And Auto Update the balance..
		autoUpdateBalance();
					
		//Callback
		callback(resp);
	});
}

/**
 * Utility Sign function - do we POST ?
 */
function utility_sign(rawtxn, post, callback){
	
	//Send
	MINIMASK.meg.signtxn(rawtxn,  USER_ACCOUNT.PRIVATEKEY, USER_ACCOUNT.KEYUSES, post, function(resp){
		
		//Update KEY USES
		USER_ACCOUNT.KEYUSES = +USER_ACCOUNT.KEYUSES+1;
		
		//Save data..
		saveUserDetails();
					
		//Callback
		callback(resp);
	});
}
