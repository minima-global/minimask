
/**
 * Get the HTML elements of the chatroom
 */
const chatarea 		= document.getElementById('id_chatroom_textarea');
const chatinput 	= document.getElementById('id_chatroom_message');
const chatbutton 	= document.getElementById('id_chatroom_chatbutton');

/**
 * Initialise chat area
 */
function chatroomInit(){
	
	wsAddListener(function(msg){
		//Is it a chat message
		if(msg.type=="chat"){
			addChatLine(msg.data, true);
		}
	});	
	
	chatinput.addEventListener("keydown", function(event) {
	    if (event.key === "Enter") {
	        getSendChat();		
	    }
	});
	
	chatbutton.addEventListener('click', () => {
		getSendChat()
	});
}

function dexChatHistory(allchat){
	
	//First wipe..
	chatarea.value = "";
	
	//Now add the chat
	try{
		for(var i=0;i<allchat.length;i++){
			addChatLine(allchat[i], false);
		}	
	}catch(err){
		console.log("Error importing startup chat.. "+JSON.stringify(allchat));	
	}
	
	//Scroll to bottom..
	setTimeout(function(){
		chatarea.scrollTop = chatarea.scrollHeight;
	}, 100);
}

//Check not too long..
var MAX_CHAT = 50000;
function addChatLine(chatobj, notify){
	
	var msg 	= chatobj.message.trim();
	var from 	= chatobj.uuid;
	
	if(msg != ""){
		
		var uuid 	= from.substring(0,8);
		var color 	= from.substring(2,8);
		
		chatarea.innerHTML += "<span style='color:#"+color+";'>"+msg+"</span><br>";
		
		//Check size
		var ftext = chatarea.innerHTML;
		var chatlen = ftext.length;
		if(chatlen > MAX_CHAT){
			var newtext = ftext.substring(chatlen-MAX_CHAT, chatlen);
			
			//Find the first end span
			var fspan = newtext.indexOf("</span>");
			if(fspan != -1){
				newtext = newtext.substring(fspan);
			} 
			
			chatarea.innerHTML = "(trimmed..)<br>"+newtext;
		}
	}

	//Scroll to bottom..
	chatarea.scrollTop = chatarea.scrollHeight;
	
	if(notify){
		if(USER_SETTINGS.notifychat){
			notification(msg);
		}
	}
}

function getSendChat(){
	var msg  = {};
	msg.type = "chat";
	
	msg.data = chatinput.value.trim();
	chatinput.value = '';
	
	if(msg.data == ""){
		return;
	}
	
	if(msg.data.length > 256){
		alert("Chat message too long.. max 256 characters");
		return;
	}
	
	wsPostToServer(msg);
} 