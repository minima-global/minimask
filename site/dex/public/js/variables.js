/**
 * User Variables
 */
var USER_NAME 	= "";
var USER_UUID 	= "";

//When I test locally (use 'hack' as the password).. 
var HACK_USER_SEED 			= "GRIEF KITTEN WOOL HARSH RESCUE VALID SLIM SECTION SHOE CLIENT LEGAL SETTLE ALONE RETREAT LINK SHIVER ILLEGAL GIRL CHAPTER MEDAL PET GENIUS WEIRD REVEAL";
var HACK_USER_ADDRESS 		= "MxG0839DENQ2AF05JPSAG6H5B9H5JBD2SZACUR5TQUAQN0RQH7CB243DK3QHWJ5";
var HACK_USER_PUBLICKEY 	= "0x0C0DF0C87BE757DE9444113014B109473CB7BE0940774DB2AED1CC5C2B956078";
var HACK_USER_PRIVATEKEY	= "0x3FF8F51DD4B92073E1E82CB8D7C0CE981EFFDCF476C4A1A190F3477CF6A7C2A3";
var HACK_USER_SCRIPT 		= "RETURN SIGNEDBY(0x0C0DF0C87BE757DE9444113014B109473CB7BE0940774DB2AED1CC5C2B956078)";
var HACK_USER_KEYUSES 		= 0;

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




