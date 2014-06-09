

/**
 * @namespace {}
 */
var hsocket = {};


/**
 * @namespace {}
 */
hsocket.constraints = {};


/**
 * @param {!Array.<?(string|number)>} command
 * @return {!Buffer}
 */
hsocket.encodeCommand = function(command) {
  var result = new Buffer(0);

  for (var i = 0; i < command.length; i++) {
    result = Buffer.concat([result, hsocket.__encodeToken(command[i])]);
    if (i < command.length - 1) {
      result = Buffer.concat([result, new Buffer(0x09.toString(16))]);
    }
  }

  result = Buffer.concat([result, new Buffer(0x0a.toString(16))]);

  return result;
};


/**
 * @param {?(string|number)} token
 * @return {!Buffer}
 */
hsocket.__encodeToken = function(token) {
  var result = new Buffer(0);

  if (typeof token === 'string') {
    for (var i = 0; i < token.length; i++) {
      result = Buffer.concat([result, hsocket.__encodeSign(token[i])]);
    }
  } else {
    result = Buffer.concat([result, hsocket.__encodeSign(token)]);
  }

  return result;
};


/**
 * @param {?(string|number)} sign
 * @return {!Buffer}
 */
hsocket.__encodeSign = function(sign) {

  if (sign === null) {
    return new Buffer(0x00.toString(16));
  }

  if (typeof sign === 'number') {
    return new Buffer(sign);
  }

  if (sign === '') {
    return new Buffer(0x09.toString(16) + 0x09.toString(16));
  }

  var code = sign.charCodeAt(0);

  if (code === 0) {
    return new Buffer(0x0a.toString(16));
  }

  if (0 < code && code < 16) {
    return new Buffer(0x01.toString(16) + (code + 0x40).toString(16));
  }

  return new Buffer(code.toString(16));
};

