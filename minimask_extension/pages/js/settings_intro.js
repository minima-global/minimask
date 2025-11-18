
addButtonOnClick('id_home_settings', function(e) {
	jumpToPage("index.html");
});

addButtonOnClick('id_update_settings', function(e) {
	
		
	var setmeg = _createSimpleMessage("account_set_custom_meg");
	
	//And Update the MEG details..
	setmeg.params 				= {};
	setmeg.params.enable 		= id_enable_custom_meg.checked;
	
	//Host Must end in /
	setmeg.params.meg_host 		= id_set_meg_host.value.trim();
	if(!setmeg.params.meg_host.endsWith("/")){
		setmeg.params.meg_host += "/";
	}
	
	setmeg.params.meg_user 		= id_set_meg_user.value.trim();
	setmeg.params.meg_password 	= id_set_meg_password.value.trim();
	
	chrome.runtime.sendMessage(setmeg, (resp) => {
		
		//All done!
		popupAlert("Settings Updated");
	});
});

//Now get the MEG details..
callSimpleServiceWorker("account_get_custom_meg", function(megres){		
	
	//Set them..
	id_enable_custom_meg.checked = megres.data.custom_meg.enable; 
	id_set_meg_host.value 		 = megres.data.custom_meg.meg_host;
	id_set_meg_user.value 		 = megres.data.custom_meg.meg_user;
	id_set_meg_password.value 	 = megres.data.custom_meg.meg_password;
});

