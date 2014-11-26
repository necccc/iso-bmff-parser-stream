/**
 *
 * @param integer
 * @returns {string}
 */
module.exports = function getBoxType (integer) {

	var type = '',
		hexWord = integer.toString(16),
		hexWordLength = hexWord.length,
		i;

	for (i = 0; i < hexWordLength; i += 2) {
		type += String.fromCharCode(parseInt(hexWord.substr(i, 2), 16));
	}

	return type;

}