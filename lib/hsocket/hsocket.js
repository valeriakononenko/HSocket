

/**
 * @namespace
 */
var hsocket = {};


/**
 * @namespace
 */
hsocket.constraints = {};


/**
 * @param {*} tokens
 * @return {!Array.<(number|string)>}
 */
hsocket.expandCommand = function(tokens) {
  var result = [];
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (token instanceof Array) {
      var expandedToken = hsocket.expandCommand(token);
      for (var j = 0; j < expandedToken.length; j++) {
        result.push(expandedToken[j]);
      }
    } else {
      result.push(token);
    }
  }
  return result;
};


/**
 * @param {!Array.<(string|number)>} command
 * @return {Buffer}
 */
hsocket.encodeCommand = function(command) {
  var result = new Buffer(0);

  for (var i = 0; i < command.length; i++) {
    result = Buffer.concat([result, hsocket.__encodeToken(command[i])]);
    if (i < command.length - 1) {
      result = Buffer.concat([result, new Buffer([0x09])]);
    }
  }

  return Buffer.concat([result, new Buffer([0x0a])]);
};


/**
 * @param {(string|number)} token
 * @return {Buffer}
 */
hsocket.__encodeToken = function(token) {

  if (token === 'NULL') {
    return new Buffer([0x00]);
  }

  if (token === '') {
    return new Buffer([0x09, 0x09]);
  }

  var result = new Buffer(0);
  var tokenString = token.toString();
  for (var j = 0; j < tokenString.length; j++) {
    result = Buffer.concat([result, hsocket.__encodeSign(tokenString[j])]);
  }

  return result;
};


/**
 * @param {(string|number)} sign
 * @return {Buffer}
 */
hsocket.__encodeSign = function(sign) {

  var code = sign.charCodeAt(0);

  if (0 <= code && code < 16) {
    return new Buffer([0x01 | code + 0x40]);
  }

  return new Buffer([code]);
};



/**
 * @param {hsocket.FilterType} filterType
 * @param {hsocket.OperationType} operationType
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
