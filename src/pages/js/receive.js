

function createQRCode(txt){
	var qrcode = new QRCode("qrcodediv", {
	    text: txt,
	    width: 200,
	    height: 200,
	    colorDark : "#000000",
	    colorLight : "#ffffff",
	    correctLevel : QRCode.CorrectLevel.H
	});	
}

function setAddress(){
	//Send a message to Service-Worker
	callSimpleServiceWorker("account_getaddress", (resp) => {
		
		if(resp.status){
			createQRCode(resp.data.address);
			getElement("address_div").innerHTML = resp.data.address; 	
		}
		 		  
	});
}


setAddress();