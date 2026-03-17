/**
 * Show various panels
 */

var NAV_SITE_DISABLED = false;

function navigate_clear(){
	id_view_maindex.style.display="none";
	id_view_wallet.style.display="none";
	id_view_allorders.style.display="none";
	id_view_alltrades.style.display="none";
	id_view_history.style.display="none";
	id_view_help.style.display="none";
	id_view_settings.style.display="none";
	id_view_minimaskmissing.style.display="none";
}

function navigate_missing(){
	NAV_SITE_DISABLED = true;
	
	navigate_clear();
	id_view_minimaskmissing.style.display="block";
}

function navigate_dex(){
	
	//Check MiniMask installed
	if(NAV_SITE_DISABLED){
		alert("MiniMask Extension missing..");
		return;
	}
	
	navigate_clear();
	id_view_maindex.style.display="block";
}

function navigate_wallet(){
	//Check MiniMask installed
	if(NAV_SITE_DISABLED){
		alert("MiniMask Extension missing..");
		return;
	}
	
	navigate_clear();
	id_view_wallet.style.display="block";
	
	//Reset balance.. will be cached by MiniMask anyway
	fetchFullBalance(function(){
		updateBalancePanel();
	});
}

function navigate_allorders(){
	//Check MiniMask installed
	if(NAV_SITE_DISABLED){
		alert("MiniMask Extension missing..");
		return;
	}
	
	navigate_clear();
	id_view_allorders.style.display="block";
}

function navigate_alltrades(){
	//Check MiniMask installed
	if(NAV_SITE_DISABLED){
		alert("MiniMask Extension missing..");
		return;
	}
	
	navigate_clear();
	id_view_alltrades.style.display="block";
}

function navigate_history(){
	//Check MiniMask installed
	if(NAV_SITE_DISABLED){
		alert("MiniMask Extension missing..");
		return;
	}
	
	navigate_clear();
	id_view_history.style.display="block";
}

function navigate_help(){
	//Check MiniMask installed
	if(NAV_SITE_DISABLED){
		alert("MiniMask Extension missing..");
		return;
	}
	
	navigate_clear();
	id_view_help.style.display="block";
}

function navigate_settings(){
	//Check MiniMask installed
	if(NAV_SITE_DISABLED){
		alert("MiniMask Extension missing..");
		return;
	}
	
	navigate_clear();
	id_view_settings.style.display="block";
}

function navigate_logout(){
	//Check MiniMask installed
	if(NAV_SITE_DISABLED){
		alert("MiniMask Extension missing..");
		return;
	}
	
	if(confirm("You are about to logout ( same as Refresh Page.. )\n\nMake sure you have a backup of your seed and key uses!")){
		//Just refresh the page..
		window.location.reload();	
	}
}