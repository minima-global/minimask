/**
 * MinimMask injected JS code
 */
		
/*function injectScript (src) {
    const s  = document.createElement('script');
    s.src 	 = chrome.runtime.getURL(src);
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
	
	console.log("Loaded MiniMask Extension");
}

injectScript('minimask.js');
*/

function ReceiveMessage(evt) {
	console.log("Content rec : "+evt.data);
}

window.addEventListener("message", ReceiveMessage, false);

setTimeout(function(){
	window.parent.postMessage("from_contect "+chrome.runtime.id, "*");
},1000);


//Send a message
chrome.runtime.sendMessage('get-user-data', (response) => {
  console.log('received user data', response);
});
