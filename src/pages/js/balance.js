/**
 * Load the balance
 */

function setBalance(resp){
		
	var baltable = document.getElementById("id_balance_table");
	for(var i=0;i<resp.data.length;i++){
		var balance = resp.data[i];
		
		var row 	= baltable.insertRow();
		var cell1 	= row.insertCell(0);
		var cell2 	= row.insertCell(1);
		
		//The name
		var name;
		if(balance.tokenid=="0x00"){
			name = document.createTextNode("Minima");
		}else{
			name = document.createTextNode(balance.token.name);
		}
		cell1.appendChild(name);
		   
		//The amount
		cell2.style.textAlign 	= "right";
		
		if(balance.unconfirmed == "0"){
			cell2.innerHTML 		= sanitizeHTML(balance.confirmed);	
		}else{
			cell2.innerHTML 		= sanitizeHTML(balance.confirmed+" ("+balance.unconfirmed+")");
		}
		
	}
	
}

function getBalance(){
	//Send a message to Service-Worker
	callSimpleServiceWorker("account_balance", (resp) => {
		setBalance(resp); 		  
	});
}

//Add button for rfefresh
//addButtonOnClick('id_btn_refresh', function(e) {
//	jumpToPage("balance.html");
//});

//Set the balance
getBalance();
