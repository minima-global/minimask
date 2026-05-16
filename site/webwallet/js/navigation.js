/**
 * Show various panels
 */

var NAV_SITE_DISABLED = false;

function navigate_clear(){
	id_view_balance.style.display="none";
	id_view_send.style.display="none";
	id_view_receive.style.display="none";
	id_view_settings.style.display="none";
	id_view_help.style.display="none";
	id_view_terms.style.display="none";
}

function navigate_balance(){
	navigate_clear();
	id_view_balance.style.display="block";
	
	//Get the new balance..
	fetchUserBalance();
}

function navigate_send(){
	navigate_clear();
	setKeyUses();
	id_view_send.style.display="block";
}

function navigate_receive(){
	navigate_clear();
	id_view_receive.style.display="block";
}

function navigate_settings(){
	navigate_clear();
	id_view_settings.style.display="block";
}

function navigate_help(){
	navigate_clear();
	id_view_help.style.display="block";
}

function navigate_terms(){
	navigate_clear();
	id_view_terms.style.display="block";
}

function navigate_logout(){
	
	if(confirm("Are you sure you want to Logout ?\n\nMake sure you have a copy of your seed!\n\nYou can view it on the Receive page..")){
		window.location.reload();	
	}
}
