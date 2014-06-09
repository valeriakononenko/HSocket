


/**
 * @param {hsocket.FilterType} filterType
 * @param {hsocket.OperationType} operationType
 * @param {!Array.<string>} columns
 * @param {string} value
 * @return {!Array.<?(string|number)>}
 * @constructor
 */
hsocket.constraints.FILTER =
    function(filterType, operationType, columns, value) {
  return [filterType, operationType, columns.join(','), value];
};



/**
 * @param {number} columnNumber
 * @param {!Array.<string>} values
 * @return {!Array.<?(string|number)>}
 * @constructor
 */
hsocket.constraints.IN = function(columnNumber, values) {
  var ivlen = values.length;
  return [columnNumber, ivlen, values.join(',')];
};



/**
 * @param {number} limit
 * @param {number} offset
 * @return {!Array.<?(string|number)>}
 * @constructor
 */
hsocket.constraints.LIMIT = function(limit, offset) {
  return [limit, offset];
};



/**
 * @param {hsocket.ModifyOperationType} modifyOperationType
 * @param {!Array.<string>} values
 * @param {boolean=} opt_asFind
 * @return {!Array.<?(string|number)>}
 * @constructor
 */
hsocket.constraints.MOD = function(modifyOperationType, values, opt_asFind) {
  var mop = opt_asFind ? modifyOperationType + '?' : modifyOperationType;
  return [mop, values.join(',')];
};
