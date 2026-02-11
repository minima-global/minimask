
const createamount 	= document.getElementById('id_createorder_amount');
const createprice 	= document.getElementById('id_createorder_price');
const createbuy 	= document.getElementById('id_createorder_buy');
const createsell 	= document.getElementById('id_createorder_sell');

function sendOrder(buysell){
	
	//How many orders do they have..
	var orderlen = USER_ORDERS.length;
	if(orderlen >= MAX_ALLOWED_ORDERS){
		alert("You have reached the maximum allowed orders : "+MAX_ALLOWED_ORDERS);
		return;
	}
	
	//Get the available balance..
	var available1 = getAvailableBalance(CURRENT_MARKET.token1.tokenid);
	var available2 = getAvailableBalance(CURRENT_MARKET.token2.tokenid);
	
	//Check values..
	var amount 	= financial(createamount.value);
	var price 	= financial(createprice.value);
	
	//Check Decimal Precision.. The AMOUNT is in Token 1
	if(getToDecimalPlacesRoundDown(amount, CURRENT_MARKET.token1.decimals) != amount){
		alert("Invalid decimals for Amount"
				+"\n\n"+CURRENT_MARKET.token1.name
				+" has "+CURRENT_MARKET.token1.decimals+" decimal places");
		return;
	}
	
	//The Price is Token 2
	if(getToDecimalPlacesRoundDown(price, CURRENT_MARKET.token2.decimals) != price){
		alert("Invalid decimals for Price"
				+"\n\n"+CURRENT_MARKET.token2.name
				+" has "+CURRENT_MARKET.token2.decimals+" decimal places");
		return;
	}
	
	//What is the total
	var tot = financial(amount * price) 
	
	//Check you have enough!
	var confmsg = "";
	if(buysell == "buy"){
		
		if(tot > available2){
			var msg = "Insufficient funds.."
					  +"\n\nYou are trying to BUY "+amount+" "+CURRENT_MARKET.token1.name+" @ "+price
					  +"\n\nThat is a total of "+tot+" "+CURRENT_MARKET.token2.name
					  +"\n\nYou currently only have "+available2+" available";
			
			alert(msg);
			return;	
		}
		
		confmsg = "Create order to BUY "+amount+" "+CURRENT_MARKET.token1.name+" @ "+price
				+"\n\nThat will be a total of "+tot+" "+CURRENT_MARKET.token2.name
				+"\n\nConfirm ? ";
		
	}else if(buysell == "sell"){
		
		if(amount > available1){
			var msg = "Insufficient funds.."
					  +"\n\nYou are trying to SELL "+amount+" "+CURRENT_MARKET.token1.name
					  +"\n\nYou currently only have "+available1+" available";
			
			alert(msg);
			return;	
		}
		
		confmsg = "Create order to SELL "+amount+" "+CURRENT_MARKET.token1.name+" @ "+price
				+"\n\nThat will be a total of "+tot+" "+CURRENT_MARKET.token2.name
				+"\n\nConfirm ? ";
	} 
	
	//Is the confirm checked..
	if(USER_SETTINGS.confirmOrders){
		//Check cnfirm
		if(!confirm(confmsg)){
			return;
		}	
	}
	
	//Do we already have an order like this..
	var prevorder = findMyOrder(buysell, price);
	if(prevorder != null){
		
		//Add to existing order
		var pamt = new Decimal(prevorder.amount);
		var namt = new Decimal(amount);
		
		prevorder.amount = ""+pamt.plus(namt);
		
		//Update all relevant
		updateMyOrders();
			
	}else{
		//Create the order
		var order = createMyOrder(buysell, amount, price);
		
		//Add to our list and post to server
		addMyOrderAndPost(order);	
	}
}

//Set up the chat room buttons..
createbuy.addEventListener('click', () => {
	sendOrder("buy");
});

createsell.addEventListener('click', () => {
	sendOrder("sell");
});

