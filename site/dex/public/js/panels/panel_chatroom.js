
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
			addChatLine(msg.data);
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
			addChatLine(allchat[i]);
		}	
	}catch(Error){
		console.log("Error importing startup chat.. "+JSON.stringify(allchat));	
	}
	
	//Scroll to bottom..
	chatarea.scrollTop = chatarea.scrollHeight;
}

//Check not too long..
var MAX_CHAT = 10000;
function addChatLine(chatline){
	if(chatline.trim() != ""){
		chatarea.value+= chatline+"\n";
		
		//Check size
		var chatlen = chatarea.value.length;
		
		if(chatlen > MAX_CHAT){
			chatarea.value = chatarea.value.substring(chatlen-MAX_CHAT, chatlen)
		}
	}

	//Scroll to bottom..
	chatarea.scrollTop = chatarea.scrollHeight;
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