/**
 * A Storage API that encrypts / decrypts
 * 
 * Requires Crypto-JS lib
 */

var STORAGE = {
	
	/**
	 * Main Password
	 */
	mainPassword : "mypassword",
	
	/*
	 * When testing.. I hack this
 	 */
	hackAdditionText : "",
	
	/**
	 * Set the main Password
	 */
	setPassword : function(password){
		STORAGE.mainPassword = password;
	},
	
	/**
	 * Set data
	 */
	setData : function(key, dataJSON){
		
		//First convert the data to a string
		var datastr = JSON.stringify(dataJSON);
		
		//Now Encrypt
		var encrypted = CryptoJS.AES.encrypt(datastr, STORAGE.mainPassword);
		
		//Now save this
		localStorage.setItem(STORAGE.hackAdditionText+key,encrypted);		
	},
	
	/**
	 * Get data
	 */
	getData : function(key){
		
		//Get the data
		var encdata = localStorage.getItem(STORAGE.hackAdditionText+key);
		
		//Check Exists
		if(encdata == null){
			return null;
		}
		
		//Now try to decrypt the data
		try{
			var decrypted = CryptoJS.AES.decrypt(encdata, STORAGE.mainPassword);
					
			//Now convert to readable string
			var datastr = decrypted.toString(CryptoJS.enc.Utf8);
			
			//Convert to JSON
			var dataJSON = JSON.parse(datastr);
			
			return dataJSON;	
			
		}catch(Error){
		
			console.log("Unable to decrypt data.. incorrect password ?");
			
			//Exists but password wrong..
			return -1;
		}
	},
	
	/**
	 * Clear data
	 */
	clearData : function(){
		localStorage.clear();	
	}
}