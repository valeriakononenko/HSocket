


/**
 * @param {number} readPort
 * @param {number} writePort
 * @param {string=} opt_host
 *
 * @constructor
 * @implements {hsocket.channel.IChannel}
 */
hsocket.Client = function(readPort, writePort, opt_host) {

  /**
   * @type {!hsocket.Client}
   */
  this.__writeChannel = new hsocket.Client(writePort, opt_host);

  /**
   * @type {!hsocket.Client}
   */
  this.__readChannel = new hsocket.Client(readPort, opt_host);

};


/**
 * @inheritDoc
 */
hsocket.Client.prototype.openIndex = function(complete, cancel, index) {
  var self = this;

  this.__writeChannel.openIndex(
      function(writeResult) {
        self.__readChannel.openIndex(
            function(readResult) {
              complete([writeResult, readResult]);
            }, cancel, index);
      }, cancel, index);
};


/**
 * @inheritDoc
 */
hsocket.Client.prototype.auth =
    function(complete, cancel, readAuthKey, writeAuthKey) {
  var self = this;

  this.__writeChannel.auth(
      function(writeResult) {
        self.__readChannel.auth(
            function(readResult) {
              complete([writeResult, readResult]);
            }, cancel, readAuthKey);
      }, cancel, writeAuthKey);
};


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {hsocket.protocol.Op} op
 * @param {!Array.<string>} values
 * @param {!Array.<string>=} opt_conditions
 */
hsocket.Client.prototype.find =
    function(complete, cancel, op, values, opt_conditions) {
  this.__readChannel.find(complete, cancel, op, values, opt_conditions);
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
hsocket.Client.prototype.update =
    function(complete, cancel, op, values, mvalues,
             isFindMode, opt_conditions) {
  this.__writeChannel.update(complete, cancel, op, values, mvalues,
      isFindMode, opt_conditions);
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
hsocket.Client.prototype.increment =
    function(complete, cancel, op, values, mvalues, isFindMode,
             opt_conditions) {
  this.__writeChannel.increment(complete, cancel, op, values, mvalues,
      isFindMode, opt_conditions);
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
hsocket.Client.prototype.decrement =
    function(complete, cancel, op, values, mvalues, isFindMode,
             opt_conditions) {
  this.__writeChannel.decrement(complete, cancel, op, values, mvalues,
      isFindMode, opt_conditions);
};


/**
 * @param {!hs.Handler} complete
 * @param {!hs.Handler} cancel
 * @param {hsocket.protocol.Op} op
 * @param {!Array.<string>} values
 * @param {boolean} isFindMode
 * @param {!Array.<string>=} opt_conditions
 */
hsocket.Client.prototype.delete =
    function(complete, cancel, op, values, isFindMode, opt_conditions) {
  this.__writeChannel.delete(complete, cancel, op, values, isFindMode,
      opt_conditions);
};


/**
 * @param {!hs.Handler} complete
 * @param {!hs.Handler} cancel
 * @param {!Array.<string>} values
 */
hsocket.Client.prototype.insert = function(complete, cancel, values) {
  this.__writeChannel.insert(complete, cancel, values);
};
