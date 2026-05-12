
function initWebWallet(){
	//Display the login screen
	id_initpanel.style.display="block";
	id_blackoutdiv.style.display="block";
}

function init_generate(){
	
	makePostRequest("random", {}, function(resp){
		//set the table
		init_generated_seed.innerHTML = resp.response.keycode;
	});
}

function init_passwordcheck(){
	var password = id_init_password.value;
	
	var params = {};
	params.seedphrase = password;
	
	makePostRequest("seedphrase", params, function(resp){
		//console.log(JSON.stringify(resp));
		
		//First get all the details..
		USER_ADDRESS 		= resp.response.miniaddress;
		USER_PRIVATE_KEY 	= resp.response.privatekey;
		USER_SCRIPT 		= resp.response.script;
		
		//Load the Key uses from local Storage..
		getLocalKeyUses();
		
		//Set them..
		setKeyUses();
		
		//set the table
		id_initpanel.style.display="none";
		id_blackoutdiv.style.display="none";
		
		//Set the account..
		setUpUserAccount();
	});
}

function setUpUserAccount(){
	
	//Get the balance
	fetchUserBalance();
	
	var qrcode = new QRCode("wallet_receiveqr", {
		    text: USER_ADDRESS,
		    width: 250,
		    height: 250,
		    colorDark : "#000000",
		    colorLight : "#ffffff",
		    correctLevel : QRCode.CorrectLevel.H
		});	
		
	document.getElementById('id_wallet_address').innerHTML = USER_ADDRESS;
}