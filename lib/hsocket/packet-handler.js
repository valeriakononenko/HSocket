


/**
 * @param {!Function} complete Result handler.
 * @param {function(string, number=)} cancel Error handler.
 * @constructor
 */
hsocket.PacketHandler = function(complete, cancel) {

  /**
   * @type {Buffer}
   */
  this.__data = null;

  /**
   * @type {boolean}
   */
  this.__isComplete = false;

};


/**
 * Returns true if a packet was handled.
 *
 * @param {!Buffer} chunk Data packet.
 * @return {boolean} Flag of packet handling.
 */
hsocket.PacketHandler.prototype.process = function(chunk) {
  this.__data = Buffer.concat([this.__data, chunk]);
  if (this.__data[this.__data.length] === 0x0a) {
    this.__isComplete = true;
  }

  return this.__isComplete;
};


/**
 * Clears a packet for reconnect.
 */
hsocket.PacketHandler.prototype.reset = function() {
  this.__data = null;
};

