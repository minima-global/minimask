
//Add click to buttons
addButtonOnClick('id_settings_logoutbtn', function(e) {
	chrome.runtime.sendMessage(_createSimpleMessage("minimask_extension_logout"), (resp) => {
		window.top.location.href = "./start.html";
	});
});

//Set the keyuses..
callSimpleServiceWorker("account_get_key_uses", function(res){
	id_keyuses_div.innerHTML = "<b>"+res.data+"</b>";
});

