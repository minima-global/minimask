
/**
 * Get a random string
 */
function getRandomHexString() {
    const hex = '0123456789ABCDEF';
    let output = '';
    for (let i = 0; i < 24; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return "0x"+output;
}

function tester(){
	return "tester";
}

module.exports = { getRandomHexString, tester };
//export { getRandomHexString };
