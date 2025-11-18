
addButtonOnClick('id_update_settings', function(e) {
	
	//Get the keys value..
	var keyuses   = getElement("send_keyuses").value.trim();
	
	// Set it..
	var setkeys 			= _createSimpleMessage("account_set_key_uses");
	setkeys.params.amount 	= keyuses;
	
	chrome.runtime.sendMessage(setkeys, (resp) => {
		
		var setmeg = _createSimpleMessage("account_set_custom_meg");
		
		//And Update the MEG details..
		setmeg.params 				= {};
		setmeg.params.enable 		= id_enable_custom_meg.checked;
		
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
});

//Set the keyuses..
callSimpleServiceWorker("account_get_key_uses", function(res){
	
	//Set the Keys uses value..
	send_keyuses.value = res.data;
	
	//Now get the MEG details..
	callSimpleServiceWorker("account_get_custom_meg", function(megres){		
		
		//Set them..
		id_enable_custom_meg.checked = megres.data.custom_meg.enable; 
		id_set_meg_host.value 		 = megres.data.custom_meg.meg_host;
		id_set_meg_user.value 		 = megres.data.custom_meg.meg_user;
		id_set_meg_password.value 	 = megres.data.custom_meg.meg_password;
		
	});
});

