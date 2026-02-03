
const blakout_panel 	= document.getElementById('id_blackoutdiv'); 
const mktaction_panel 	= document.getElementById('id_buyselldiv'); 
const mktamount_slider 	= document.getElementById('id_mktamountrange');
const mktcurrentamount 	= document.getElementById('id_mktcurrentamount');
const mkttotal 			= document.getElementById('id_mkttotal');

mktamount_slider.addEventListener("input", (event) => {
	setCurrentAmount(event.target.value);
});

var MKT_BUYSELL 			= "";

var MKT_CURRENT_MAXAMOUNT 	= 0;
var MKT_CURRENT_PRICE 		= 0;

var MKT_CURRENT_AMOUNT		= 0;
var MKT_TOTAL_AMOUNT		= 0;

function setCurrentAmount(perc){
	
	//Calculate Amount - ROUND UP and to decimal place
	MKT_CURRENT_AMOUNT = financial(perc * MKT_CURRENT_MAXAMOUNT);
	MKT_CURRENT_AMOUNT = getToDecimalPlacesRoundDown(MKT_CURRENT_AMOUNT, CURRENT_MARKET.token1.decimals);
	
	mktcurrentamount.innerHTML = MKT_CURRENT_AMOUNT+" "+CURRENT_MARKET.token1.name;
	
	//Calculate 
	var decmktamount 	= new Decimal(MKT_CURRENT_AMOUNT);
	var decmktprice 	= new Decimal(MKT_CURRENT_PRICE);
	var decmkttotal		= decmktamount.times(decmktprice);
	
	//Make Sure you round UP or DOWN depending on the sale type..
	if(MKT_BUYSELL){
		
		//Round UP				
		MKT_TOTAL_AMOUNT 	= financialDecimal(decmkttotal);
		MKT_TOTAL_AMOUNT	= getToDecimalPlacesRoundDown(MKT_TOTAL_AMOUNT, CURRENT_MARKET.token2.decimals);
				
		mkttotal.innerHTML = MKT_TOTAL_AMOUNT+" "+CURRENT_MARKET.token2.name;	
		
	}else{
		
		//Round DOWN			
		MKT_TOTAL_AMOUNT 	= financialDecimalRDown(decmkttotal);
		MKT_TOTAL_AMOUNT	= getToDecimalPlacesRoundDown(MKT_TOTAL_AMOUNT, CURRENT_MARKET.token2.decimals);
		
		mkttotal.innerHTML = MKT_TOTAL_AMOUNT+" "+CURRENT_MARKET.token2.name;
	}
}

function resetMKTValues(){
	
	if(MKT_BUYSELL){
		MKT_CURRENT_AMOUNT 	= financial(MKT_CURRENT_MAXAMOUNT); 
		MKT_TOTAL_AMOUNT 	= financial(MKT_CURRENT_AMOUNT * MKT_CURRENT_PRICE);
	}else{
		MKT_CURRENT_AMOUNT 	= financialRDown(MKT_CURRENT_MAXAMOUNT); 
		MKT_TOTAL_AMOUNT 	= financialRDown(MKT_CURRENT_AMOUNT * MKT_CURRENT_PRICE);
	}
	
	//Set decimals
	MKT_CURRENT_AMOUNT 	= getToDecimalPlacesRoundDown(MKT_CURRENT_AMOUNT, CURRENT_MARKET.token1.decimals);
	MKT_TOTAL_AMOUNT	= getToDecimalPlacesRoundDown(MKT_TOTAL_AMOUNT, CURRENT_MARKET.token2.decimals);
}

function showMktActionPanel(buysell, price, maxamount){
	
	MKT_CURRENT_PRICE		= price;
	MKT_CURRENT_MAXAMOUNT 	= maxamount;
	MKT_BUYSELL				= buysell;
	
	resetMKTValues();
	
	//Set the slider
	mktamount_slider.value = 1;
	setCurrentAmount(1);
	
	//BUY or SELL action
	if(buysell){
		id_mktaction_details.innerHTML = "You are about to <b>BUY</b> "+CURRENT_MARKET.token1.name+" for "+CURRENT_MARKET.token2.name;
	}else{
		id_mktaction_details.innerHTML = "You are about to <b>SELL</b> "+CURRENT_MARKET.token1.name+" for "+CURRENT_MARKET.token2.name;
	}
	
	id_mktaction_price.innerHTML 		= price;
	id_mktaction_maxamount.innerHTML 	= maxamount;
	
	blakout_panel.style.display = "block";
	mktaction_panel.style.display = "block";	
}

function hideMktActionPanel(){
	blakout_panel.style.display = "none";
	mktaction_panel.style.display = "none";
}
