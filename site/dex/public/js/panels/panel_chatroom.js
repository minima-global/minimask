
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
			//console.log("Chat room : "+JSON.stringify(msg));
			
			//Add the UUID..
			var shortuuid = msg.uuid.substring(2,10);
			
			chatarea.value+= shortuuid+" > "+msg.data+"\n";
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

function getSendChat(){
	var msg  = {};
	msg.type = "chat";
	
	//msg.data = USER_NAME+" > "+chatinput.value.trim();
	msg.data = chatinput.value.trim();
	
	chatinput.value = '';
	
	if(msg.data == ""){
		return;
	}
	
	wsPostToServer(msg);
} 