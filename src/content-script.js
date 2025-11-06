/**
 * MinimMask injected JS code
 */
function injectScript (src) {
    const s  = document.createElement('script');
	s.src 	 = chrome.runtime.getURL(src);
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
	
	console.log("Loaded MiniMask Extension into page");
}

injectScript('minimask.js');

/**
 * Listen out for messages and forward to Service Worker
 */
var CONTENTJS_LOGGING = false;
function contentjsReceiveMessage(evt) {
	
	//Check Valid.. origin always null.. 
	/*if (evt.origin !== window.location.origin){
		console.log("Content-Js ReceiveMessage : Invalid Location Sent message!");
		console.log("Evt:"+evt.origin+" Window:"+window.location.origin);
		return;
	} */
	
	//Get the message
	var msg = evt.data;
		
	if(!msg){
		return;
	}else if(msg.minitype != "MINIMASK_REQUEST"){
		return;
	}
	
	//Log it..
	if(CONTENTJS_LOGGING){
		console.log("Content-Js ReceiveMessage : "+JSON.stringify(msg));	
	}
	
	//Content can send messages to Service Worker
	chrome.runtime.sendMessage(msg.action, (response) => {
		
		if(CONTENTJS_LOGGING){
			console.log("Content-Js ReceiveResponse : "+JSON.stringify(response));
		}
		
		var resp 		= {};
		resp.minitype	= "MINIMASK_RESPONSE";
		resp.randid		= msg.randid;
		resp.data 		= response;
		
		//Send this to the top window.. origin /
		window.postMessage(resp);	  
	});
}

//Listen for messages
window.addEventListener("message", contentjsReceiveMessage);
