

/**
 * @param {hsocket.protocol.Mop} mop
 * @param {!Array.<string>} mvalues
 * @param {boolean} isFindMode
 * @return {!Array.<string>}
 */
hsocket.protocol.MOD = function(mop, mvalues, isFindMode) {
  var mod = [mop + (isFindMode ? hsocket.protocol.Mop.FIND : '')];

  for (var i = 0; i < mvalues.length; i++) {
    mod.push(mvalues[i]);
  }

  return mop;
};


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {!Array.<string>} mvalues
 * @param {!Array.<string>} values
 */
hsocket.protocol.checkMod = function(complete, cancel, mvalues, values) {
  if (mvalues.length > values.length) {
    cancel('[HSOCKET] Wrong number of modified values.');
  } else {
    complete(mvalues);
  }
};


/**
 * @param {!Buffer} data
 * @return {!Array.<string>}
 */
hsocket.protocol.decode = function(data) {

  var result = [];
  var separator = opt_separator || 0x09;
  var item = new Buffer(0);
  var i = 0;
  var l = opt_groupLength || result.length;

  while (i <= request.length) {

    if ((i === request.length) || (request[i] === separator)) {
      result.push(item.toString());
      item = new Buffer(0);
    } else {
      item = Buffer.concat([item, new Buffer([request[i]])]);
    }

    i += 1;
  }

  /**
   * @return {!Array.<(string|!Array.<string>)>}
   */
  function group() {
    var groups = [];

    if (l === result.length) {
      return result;
    } else {
      var j = 0;
      var group = [];

      while (j < result.length) {

        if ((j !== 0) && (j % l === 0)) {
          groups.push(group);
          group = [];
        }
        group.push(result[j]);
        j += 1;
      }

      if (group.length) {
        groups.push(group);
      }

    }
    return groups;
  }

  return group();
};


/**
 * @param {!Array.<string>} command
 * @return {!Buffer}
 */
hsocket.protocol.encode = function(command) {
  var result = new Buffer(0);

  for (var i = 0; i < command.length; i++) {
    result = Buffer.concat([result, hsocket.protocol.__encodeToken(command[i])]);
    if (i < command.length - 1) {
      result = Buffer.concat([result, new Buffer([0x09])]);
    }
  }

  return Buffer.concat([result, new Buffer([0x0a])]);
};


/**
 * @param {(string|number)} token
 * @return {!Buffer}
 */
hsocket.protocol.__encodeToken = function(token) {

  if (token === 'NULL') {
    return new Buffer([0x00]);
  }

  if (token === '') {
    return new Buffer([0x09, 0x09]);
  }

  var result = new Buffer(0);
  var tokenString = token.toString();
  for (var j = 0; j < tokenString.length; j++) {
    result = Buffer.concat([result, hsocket.protocol.__encodeSign(tokenString[j])]);
  }

  return result;
};


/**
 * @param {(string|number)} sign
 * @return {!Buffer}
 */
hsocket.protocol.__encodeSign = function(sign) {

  var code = sign.charCodeAt(0);

  if (0 <= code && code < 16) {
    return new Buffer([0x01 | code + 0x40]);
  }

  return new Buffer([code]);
};