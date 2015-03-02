

/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 * @implements {hsocket.channel.IChannel}
 */
hsocket.channel.__Channel = function(port, opt_host) {

  /**
   * @type {!md.Connection}
   */
  this.__connection = new md.Connection(port, opt_host);

  /**
   * @type {?hsocket.Index}
   */
  this.__index = null;

};


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {!hsocket.Index} index
 */
hsocket.channel.__Channel.prototype.openIndex =
    function(complete, cancel, index) {
  var context = this;
  var command = ['P',
    index.getId(), index.getDBName(), index.getTableName(), index.getName()]
      .concat(index.getColumns())
      .concat(index.getFilterColumns());

  this._request(function(result) {
    context.__index = index;
    complete(result);
  }, cancel, command);
};


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {string} akey
 */
hsocket.channel.__Channel.prototype.auth = function(complete, cancel, akey) {
  this._request(complete, cancel, ['A', '1', akey]);
};


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {!Array.<string>} args
 */
hsocket.channel.__Channel.prototype._request =
    function(complete, cancel, args) {
  this.__connection.request(hsocket.encode(args),
      new hsocket.PacketHandler(complete, cancel));
};


/**
 * @param {!function(!hsocket.Index)} complete
 * @param {!hsocket.Handler} cancel
 */
hsocket.channel.__Channel.prototype._getIndex = function(complete, cancel) {
  if (this.__index !== null) {
    complete(this.__index);
  } else {
    cancel('[HSOCKET] Index is not set.');
  }
};
