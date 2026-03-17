/**
 * Load the saved History
 */
function initHistory(){
	
	//Load
	USER_HISTORY = STORAGE.getData("**USER_HISTORY**");
	
	//Check if exists
	if(USER_HISTORY == null){
		USER_HISTORY = [];
	}
	
	//Order inverse
	USER_HISTORY.sort(sortHistoryByTime);
	
	//Reset the view..
	showHistory();
}

function saveHistory(){
	//Store!
	STORAGE.setData("**USER_HISTORY**",USER_HISTORY);
	
	//console.log("SAVE HISTORY : "+JSON.stringify(USER_HISTORY));
}

function clearHistory(){
	
	if(confirm("Are you sure you wish to clear ALL your history ?")){
		USER_HISTORY = [];
			
		//Save it for later
		saveHistory();

		//Reset the view..
		showHistory();	
	}
}

function exportHistory(type){
	
	if(confirm("This will download your History as a "+type+" file.. ?")){
		
		//Create a CSV of the DATA
		var totalCSV = "";
		if(type=="CSV"){
			totalCSV += "timemilli , date, action, details, extra,";
			
			var len = USER_HISTORY.length;
			for(var i=0;i<len;i++) {
				var history=USER_HISTORY[i];
			
				totalCSV +=  history.time+","
							+getTimeStr(history.time)+","
							+history.action+","
							+history.details+","
							+history.extra+",";
			}
		}else{
			totalCSV = JSON.stringify(USER_HISTORY);
		}
				
		// create an anchor element that we can programmatically click
		const a = document.createElement('a');

		// set up a data uri with the text
		a.href = `data:text/plain,${totalCSV}`;

		// set the download attribute so it downloads and uses this as a filename
		var ctime = getTimeMilli();
		a.download = "dex_history_"+type+"_"+ctime+".txt";

		// stick it in the document
		document.body.appendChild(a);

		// click it
		a.click();	
	}
}

function addHistoryLog(action, details, extra){
	
	var history 	= {};
	history.time 	= getTimeMilli();
	history.action 	= action;
	history.details = details;
	history.extra 	= extra;
	
	USER_HISTORY.push(history);
	
	//Order inverse
	USER_HISTORY.sort(sortHistoryByTime);
		
	//Save it for later
	saveHistory();
	
	//Reset the view..
	showHistory();
}
