
const confirmcheck 	= document.getElementById('id_settings_createorder_confirm');
const notifytrade 	= document.getElementById('id_settings_notify_trade');
const notifychat 	= document.getElementById('id_settings_notify_chat');

confirmcheck.addEventListener('click', () => {
	USER_SETTINGS.confirmOrders = confirmcheck.checked;
	saveUserSettings();
});

notifytrade.addEventListener('click', () => {
	USER_SETTINGS.notifytrade = notifytrade.checked;
	if(USER_SETTINGS.notifytrade){
		requestNotifications();
	}
	saveUserSettings();
});

notifychat.addEventListener('click', () => {
	USER_SETTINGS.notifychat = notifychat.checked;
	if(USER_SETTINGS.notifychat){
		requestNotifications();
	}
	saveUserSettings();
});

function initSettings(){
	confirmcheck.checked 	= USER_SETTINGS.confirmOrders;
	notifytrade.checked 	= USER_SETTINGS.notifytrade;
	notifychat.checked 		= USER_SETTINGS.notifychat;
}

function loadUserSettings(){
	//Load
	USER_SETTINGS = STORAGE.getData("**USER_SETTINGS**");
	
	//Check if exists
	if(USER_SETTINGS == null){
		USER_SETTINGS = {};
	}
	
	if(typeof(USER_SETTINGS.confirmOrders) == "undefined"){
		USER_SETTINGS.confirmOrders = true;
	}
	
	if(typeof(USER_SETTINGS.notifytrade) == "undefined"){
		USER_SETTINGS.notifytrade = false;
	}
	
	if(typeof(USER_SETTINGS.notifychat) == "undefined"){
		USER_SETTINGS.notifychat = false;
	}
}

function saveUserSettings(){
	STORAGE.setData("**USER_SETTINGS**",USER_SETTINGS);
}
