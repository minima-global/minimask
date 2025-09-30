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


function contentjsReceiveMessage(evt) {
	
	//Get the message
	var msg = evt.data;
		
	if(!msg){
		return;
	}else if(msg.minitype != "MINIMASK_REQUEST"){
		return;
	}
	
	console.log("Content-Js ReceiveMessage : "+JSON.stringify(evt.data));

	//Send message to service-worker
	chrome.runtime.sendMessage(msg, (response) => {
	  	
		var msg 		= {};
		msg.minitype	= "MINIMASK_RESPONSE";
		msg.randid		= evt.data.randid;
		msg.data 		= response;
		
		//Send this to the top window.. origin /
		window.top.postMessage(msg);	  
	});
}

//Listen for messages
window.top.addEventListener("message", contentjsReceiveMessage);



