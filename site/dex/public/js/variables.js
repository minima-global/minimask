/**
 * User Variables
 */
var USER_NAME 	= "";
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
const NULL_MARKET 			= {};
NULL_MARKET.mktname			= "NULL / NULL";
NULL_MARKET.mktuid			= "0xFF / 0xFF";
NULL_MARKET.token1 			= {};
NULL_MARKET.token1.name 	= "NULL";
NULL_MARKET.token1.tokenid 	= "0xFF";
NULL_MARKET.token2 			= {};
NULL_MARKET.token2.name 	= "NULL";
NULL_MARKET.token2.tokenid 	= "0xFF";

/**
 * Which Market is this
 */
var CURRENT_MARKET 	= NULL_MARKET;




