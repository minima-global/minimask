/**
 * User Variables
 */
var USER_NAME 	= "";

/**
 * Your server UUID
 */
var USER_UUID 	= "";

/**
 * The User Account details
 */
var USER_ACCOUNT 		= {};

/**
 * All tokens the User has
 */
var USER_BALANCE 	= [];

/**
 * Complete list of User orders
 */
var USER_ORDERS = [];

/**
 * All your actions are stored in HISTORY
 */
var USER_HISTORY = [];

/**
 * ALL orders - sorted by UUID
 */
var ALL_ORDERS = {};

/**
 * What Markets are available.. based on the tokens of all users connected
 */
var ALL_MARKETS = [];

/**
 * List of all the trades!
 */
var ALL_TRADES = [];

/**
 * NULL Market
 */
const NULL_MARKET 				= {};
NULL_MARKET.mktname				= "NULL / NULL";
NULL_MARKET.mktuid				= "0xFF / 0xFF";
NULL_MARKET.token1 				= {};
NULL_MARKET.token1.name 		= "NULL";
NULL_MARKET.token1.tokenid 		= "0xFF";
NULL_MARKET.token1.decimals 	= 8;
NULL_MARKET.token2 				= {};
NULL_MARKET.token2.name 		= "NULL";
NULL_MARKET.token2.tokenid 		= "0xFF";
NULL_MARKET.token2.decimals 	= 8;

/**
 * Which Market is this
 */
var CURRENT_MARKET 	= NULL_MARKET;

/**
 * General User Settings
 */
var USER_SETTINGS 			= {};

function loadUserSettings(){
	//Load
	USER_SETTINGS = STORAGE.getData("**USER_SETTINGS**");
	
	//Check if exists
	if(USER_SETTINGS == null){
		USER_SETTINGS = {};
		USER_SETTINGS.confirmOrders = true;
	}
}

function saveUserSettings(){
	STORAGE.setData("**USER_SETTINGS**",USER_SETTINGS);
}

/**
 * Maximumum orders a User can have (Checked by server)
 */
var MAX_ALLOWED_ORDERS = 50;
/**
 * Maximumum trades to store and show
 */
var MAX_TRADES_STORED = 1000;


