/**
 * The DEX server to connect to
 */
const DEX_SERVER = "wss://minimask.org:54321";

/**
 * MxUSD Market
 */
var MXUSD_TOKENID = "0xFFEEDDFFEEDD";

const MXUSD_MARKET = {};
MXUSD_MARKET.mktname			= "Minima / MxUSD";
MXUSD_MARKET.mktuid				= "0x00 / "+MXUSD_TOKENID;
MXUSD_MARKET.token1 			= {};
MXUSD_MARKET.token1.name 		= "Minima";
MXUSD_MARKET.token1.tokenid 	= "0x00";
MXUSD_MARKET.token2 			= {};
MXUSD_MARKET.token2.name 		= "MxUSD";
MXUSD_MARKET.token2.tokenid 	= MXUSD_TOKENID;

/**
 * Here you add an array of markets that you wish your DEX to support
 */
var DEX_PRESET_PAIRS = [];
DEX_PRESET_PAIRS.push(MXUSD_MARKET);

/**
 * Do we add PRESET pairs to the exchange ?
 */
var DEX_ADD_PRESET_PAIRS = true;

/**
 * Do we allow OTHER Minima markets made up from all tokens of users connected ?
 */
var DEX_ADD_USER_TOKENS = true;