/**
 * MinimMask injected JS code
 */

console.log("Content Script loaded..");
		
function injectScript (src) {
    const s  = document.createElement('script');
	s.src 	 = chrome.runtime.getURL(src);
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
	
	console.log("Loaded MiniMask Extension into page");
}

injectScript('minimask.js');


function ReceiveMessage(evt) {
	console.log("Content-Js rec : "+JSON.stringify(evt.data));

	//Send message to service-worker
	chrome.runtime.sendMessage(evt.data, (response) => {
	  console.log('sendMessage : received user data', response);
	});
		
	/*sendExtMessage("hello",function(){
		
	});*/
}

//Listen for messages
window.addEventListener("message", ReceiveMessage);

//console.log("EXT ID : "+chrome.runtime.id);
/*setTimeout(function(){
	
	var EXT_ID 		= {};
	EXT_ID.event 	= "MINIMASK_EXTENSION_ID";
	EXT_ID.data 	= chrome.runtime.id; 
	
	//window.parent.postMessage(EXT_ID, "*");
	window.parent.postMessage(EXT_ID);
},10);

//Send a message
chrome.runtime.sendMessage('get-user-data', (response) => {
  console.log('content : received user data', response);
});
*/

/**
 * Send a message to the backend..
 */
/*function sendExtMessage(extmessage, callback){
	console.log('sendExtMessage : '+extmessage);
	
	chrome.runtime.sendMessage(extmessage, (response) => {
	  console.log('sendExtMessage response ', response);
	  
	  //Send the reply back..
	  callback(response);
	});
}*/

//Test function
//function testerFunction(){
//	console.log("Running tester function injected code..!");
//}
