


/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 * @extends {hsocket.channel.__Channel}
 */
hsocket.channel.Read = function(port, opt_host) {
  hsocket.channel.__Channel.call(this, port, opt_host);
};

util.inherits(hsocket.channel.Read, hsocket.channel.__Channel);


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {hsocket.protocol.Op} op
 * @param {!Array.<string>} values
 * @param {!Array.<string>=} opt_conditions
 */
hsocket.channel.Read.prototype.find =
    function(complete, cancel, op, values, opt_conditions) {
  var context = this;

  this._getIndex(function(index) {
    var command = [index.getId(), op, String(values.length)]
        .concat(values)
        .concat(opt_conditions || []);

    context._request(complete, cancel, command);
  }, cancel);
};
