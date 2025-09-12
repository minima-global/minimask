/**
 * JS function for iondex.html
 */

//Add click to buttons
getElement('id_btn_proceedwallet').addEventListener('click', function(e) {
	jumpToPage("createwallet.html");
});

getElement('id_btn_cancelwallet').addEventListener('click', function(e) {
	jumpToPage("index.html");
});
