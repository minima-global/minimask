/**
 * MEG Host details
 */
MINIMASK_MEG_HOST 		= "http://127.0.0.1:8080/";
MINIMASK_MEG_USER 		= "apicaller";
MINIMASK_MEG_PASSWORD 	= "apicaller";



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

function createServiceWorkerURL(msg){

	var ret 	= {};
	ret.url 	= "";
	ret.params 	= {};
	
	if(msg.action.function ==  "create"){
		ret.url = MINIMASK_MEG_HOST+"wallet/create";
	
	}else if(msg.action.function ==  "block"){
		ret.url = MINIMASK_MEG_HOST+"wallet/block";
		
	}
	
	return ret;	
}


function contentjsReceiveMessage(evt) {
	
	//Get the message
	var msg = evt.data;
		
	if(!msg){
		return;
	}else if(msg.minitype != "MINIMASK_REQUEST"){
		return;
	}
	
	console.log("Content-Js ReceiveMessage : "+JSON.stringify(msg));

	var call = createServiceWorkerURL(msg);
	
	console.log("Content-Js URL : "+JSON.stringify(call));

	
	//Send message to service-worker
	chrome.runtime.sendMessage(call, (response) => {
	  	
		var resp 		= {};
		resp.minitype	= "MINIMASK_RESPONSE";
		resp.randid		= msg.randid;
		resp.data 		= response;
		
		//Send this to the top window.. origin /
		window.top.postMessage(resp);	  
	});
}

//Listen for messages
window.top.addEventListener("message", contentjsReceiveMessage);



