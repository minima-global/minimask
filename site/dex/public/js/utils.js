/**
 * Utility Funcions
 */
var DECIMAL_ZERO 	= new Decimal(0);
const MAX_DECIMAL 	= 8;

var HOURS_24		= 1000 * 60 * 60 * 24;

function getRandomHexString() {
    const hex = '0123456789ABCDEF';
    let output = '';
    for (let i = 0; i < 24; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return "0x"+output;
}

function getRandom(max){
	return Math.floor(Math.random() * max); 
}

function financial(x) {
  return financialDecimal(new Decimal(x));		
}

function financialDecimal(x) {
  return decimalRUp(x).toNumber();		
}

function decimalRUp(x) {
  return decimalRUpPrecision(x, MAX_DECIMAL);		
}

function decimalRUpPrecision(x, decimals) {
  return x.toDecimalPlaces(decimals, Decimal.ROUND_UP);		
}

function financialRDown(x) {
  return financialDecimalRDown(new Decimal(x));		
}

function financialDecimalRDown(x) {
  return decimalRDown(x).toNumber();		
}

function decimalRDown(x) {
  return decimalRDownPrecision(x, MAX_DECIMAL);		
}

function decimalRDownPrecision(x, decimals) {
  return x.toDecimalPlaces(decimals, Decimal.ROUND_DOWN);		
}

function getToDecimalPlacesRoundDown(num, decimals){
	return decimalRDownPrecision(new Decimal(num), decimals).toNumber();
}

function getToDecimalPlacesRoundUp(num, decimals){
	return decimalRUpPrecision(new Decimal(num), decimals).toNumber();
}

function getTimeMilli(){
	//Date as of NOW
	var recdate = new Date();
	return recdate.getTime();
}

function getTimeStr(timemilli){
	var dd = new Date(timemilli);
	
	var hour = dd.getUTCHours();
	
	var min  = dd.getUTCMinutes();
	var strmin = min+"";  
	if(min<10){
		strmin="0"+min; 
	}
	
	var secs = dd.getUTCSeconds()
	var strsecs = ""+secs;
	if(secs<10){
		strsecs="0"+secs; 
	}
	
	var dateString = hour+":"+strmin+":"+strsecs+" " 
					+dd.getUTCDate()+"/"
 					+(dd.getUTCMonth()+1)+"/"
 					+dd.getUTCFullYear()
 						 				 
	return dateString;
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

function sortUserOrdersAlphabetically(a,b){
	var nameA = a.market.mktname.toLowerCase(); 
	var nameB = b.market.mktname.toLowerCase(); 
	
	if(nameA.startsWith("minima")){
		nameA="A";
	}
	
	if(nameB.startsWith("minima")){
		nameB="A";
	}
	
	if (nameA < nameB) {
	  return -1;
	}
	if (nameA > nameB) {
	  return 1;
	}
	
	// names must be equal
	return 0;
}

function sortMarketsAlphabetically(a,b){
	var nameA = a.mktname.toLowerCase(); 
	var nameB = b.mktname.toLowerCase();
	
	if(nameA.startsWith("minima")){
		nameA="A";
	}
	
	if(nameB.startsWith("minima")){
		nameB="A";
	}
	
	if (nameA < nameB) {
	  return -1;
	}
	if (nameA > nameB) {
	  return 1;
	}	

	return 0;
}

function sortTradesByTime(a,b){
	if (a.date < b.date) {
	  return 1;
	}
	if (a.date > b.date) {
	  return -1;
	}	

	return 0;
}

function sortMyOrders(a,b){
	
	if(a.type == b.type){
		var aprice = new Decimal(a.price);
		var bprice = new Decimal(b.price);
		
		if(aprice.lessThan(bprice)){
			return 1;
		}
		
		if(bprice.lessThan(aprice)){
			return -1;
		}
		
		return 0;	
	}
	
	if(a.type == "buy"){
		return 1;
	}
		
	return -1;
}

function compareDesc(a,b){
	
	var deca = new Decimal(a.price);
	var decb = new Decimal(b.price);
	
	if(deca.lessThan(decb)){
		return 1;
	}
	
	if(decb.lessThan(deca)){
		return -1;
	}
	
	return 0;
}

function sortHistoryByTime(a,b){
	if (a.time < b.time) {
	  return 1;
	}
	if (a.time > b.time) {
	  return -1;
	}	

	return 0;
}

function requestNotifications() {

  console.log("Notification Permission : "+Notification.permission);		
	
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
	//notification("Thisis a test!!");
	//const notification = new Notification("Hi there!");
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
		notification("Notifications Enabled!");
		//const notification = new Notification("Notifications Enabled!");
        // …
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}

function notification(text){
	if(isPageHidden()){
		const notification = new Notification("Minima DEX", {
		  body: text,
		  icon: "./images/minima128.png",
		});	
	}
}

function isPageHidden(){
	return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
}
