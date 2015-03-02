

/**
 * @namespace
 */
var hsocket = {};





/**
 * @namespace
 */
hsocket.constraints = {};


/**
 *
 */
hsocket.nop = function() {};


/**
 * @param {hsocket.FilterType} filterType
 * @param {hsocket.protocol.Op} operationType
 * @param {number} position
 * @param {string} value
 * @return {!Array.<(string|number)>}
 * @constructor
 */
hsocket.FILTER = function(filterType, operationType, position, value) {
  return [filterType, operationType, position, value];
};



/**
 * @param {number=} opt_limit
 * @param {number=} opt_offset
 * @return {!Array.<number>}
 * @constructor
 */
hsocket.LIMIT = function(opt_limit, opt_offset) {
  var limit = opt_limit || 1;
  var offset = opt_offset || 0;
  return [limit, offset];
};
