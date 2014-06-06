


/**
 * @param {number} port
 * @param {string=} opt_host
 * @constructor
 */
hsocket.Connection = function(port, opt_host) {

  /**
   * @type {!Arguments}
   */
  this.__destination = arguments;

  /**
   * @type {net.Socket}
   */
  this.__socket = null;

  /**
   *
   */
  this.__handleConnection = function() {

  };

  /**
   *
   */
  this.__handleData = function() {

  };

  /**
   *
   */
  this.__handleClose = function() {

  };

  /**
   *
   */
  this.__handleError = function() {

  };

};


/**
 *
 */
hsocket.Connection.prototype.__connect = function() {

  this.__socket = new net.Socket();
  this.__socket.addListener('connect', this.__handleConnection);
  this.__socket.addListener('data', this.__handleData);
  this.__socket.addListener('close', this.__handleClose);
  this.__socket.addListener('error', this.__handleError);

  this.__socket.connect.apply(this.__socket, this.__destination);
};