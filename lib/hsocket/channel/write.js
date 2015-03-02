


/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 * @extends {hsocket.channel.__Channel}
 */
hsocket.channel.Write = function(port, opt_host) {
  hsocket.channel.__Channel.call(this, port, opt_host);
};

util.inherits(hsocket.channel.Write, hsocket.channel.__Channel);


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {hsocket.protocol.Op} op
 * @param {!Array.<string>} values
 * @param {hsocket.protocol.Mop} mop
 * @param {!Array.<string>} mvalues
 * @param {boolean} isFindMode
 * @param {!Array.<string>=} opt_conditions
 */
hsocket.channel.Write.prototype.__findModify =
    function(complete, cancel, op, values, mop, mvalues,
             isFindMode, opt_conditions) {
  var context = this;

  this._getIndex(function(index) {
    hsocket.protocol.checkMod(function(mvalues) {
      var command = [index.getId(), op, String(values.length)]
          .concat(values)
          .concat(opt_conditions || [])
          .concat(hsocket.protocol.MOD(mop, mvalues, isFindMode));
      context._request(complete, cancel, command);
    }, cancel, mvalues, values);
  }, cancel);
};


/**
 * @param {!hs.Handler} complete
 * @param {!hs.Handler} cancel
 * @param {hsocket.protocol.Op} op 
 * @param {!Array.<string>} values 
 * @param {!Array.<string>} mvalues
 * @param {boolean} isFindMode
 * @param {!Array.<string>=} opt_conditions
 */
hsocket.channel.Write.prototype.update =
    function(complete, cancel, op, values, mvalues, isFindMode,
             opt_conditions) {
  this.__findModify(complete, cancel, op, values,
        hsocket.protocol.Mop.UPDATE, mvalues, isFindMode, opt_conditions);
};


/**
 * @param {!hs.Handler} complete
 * @param {!hs.Handler} cancel
 * @param {hsocket.protocol.Op} op
 * @param {!Array.<string>} values
 * @param {!Array.<string>} mvalues
 * @param {boolean} isFindMode
 * @param {!Array.<string>=} opt_conditions
 */
hsocket.channel.Write.prototype.increment =
    function(complete, cancel, op, values, mvalues, isFindMode,
             opt_conditions) {
  this.__findModify(complete, cancel, op, values,
      hsocket.protocol.Mop.INCREMENT, mvalues, isFindMode, opt_conditions);
};


/**
 * @param {!hs.Handler} complete
 * @param {!hs.Handler} cancel
 * @param {hsocket.protocol.Op} op
 * @param {!Array.<string>} values
 * @param {!Array.<string>} mvalues
 * @param {boolean} isFindMode
 * @param {!Array.<string>=} opt_conditions
 */
hsocket.channel.Write.prototype.decrement =
    function(complete, cancel, op, values, mvalues, isFindMode,
             opt_conditions) {
  this.__findModify(complete, cancel, op, values,
      hsocket.protocol.Mop.DECREMENT, mvalues, isFindMode, opt_conditions);
};


/**
 * @param {!hs.Handler} complete
 * @param {!hs.Handler} cancel
 * @param {hsocket.protocol.Op} op
 * @param {!Array.<string>} values
 * @param {boolean} isFindMode
 * @param {!Array.<string>=} opt_conditions
 */
hsocket.channel.Write.prototype.delete =
    function(complete, cancel, op, values, isFindMode, opt_conditions) {
  this.__findModify(complete, cancel, op, values,
      hsocket.protocol.Mop.DELETE, [], isFindMode, opt_conditions);
};


/**
 * @param {!hs.Handler} complete
 * @param {!hs.Handler} cancel
 * @param {!Array.<string>} values
 */
hsocket.channel.Write.prototype.insert = function(complete, cancel, values) {
  var context = this;

  this._getIndex(function(index) {
    var command = [index.getId(), hsocket.protocol.Mop.INCREMENT,
      String(values.length)].concat(values);

    context._request(complete, cancel, command);
  }, cancel);
};
