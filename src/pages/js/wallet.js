/**
 * JS function for iondex.html
 */

//Add click to buttons
addButtonOnClick('id_wallet_balance', function(e) {
	getElement("mainiframe").src="./balance.html";
	//alert("Hello..");
});

addButtonOnClick('id_wallet_send', function(e) {
	getElement("mainiframe").src="./send.html";
});

addButtonOnClick('id_wallet_receive', function(e) {
	getElement("mainiframe").src="./receive.html";
});

addButtonOnClick('id_img_settings', function(e) {
	getElement("mainiframe").src="./settings.html";
});

addButtonOnClick('id_img_pending', function(e) {
	getElement("mainiframe").src="./pending.html";
});
