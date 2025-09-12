/**
 * JS function for iondex.html
 */

//Add click to buttons
getElement('id_btn_restorewallet').addEventListener('click', function(e) {
	jumpToPage("wallet.html");
});

getElement('id_btn_cancelwallet').addEventListener('click', function(e) {
	jumpToPage("index.html");
});
