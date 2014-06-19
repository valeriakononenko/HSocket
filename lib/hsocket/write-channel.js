


/**
 * @param {number} port
 * @param {string=} opt_host
 * @extends {hsocket.Connection}
 * @implements {hsocket.IChannel}
 * @constructor
 */
hsocket.WriteChannel = function(port, opt_host) {
  hsocket.Connection.call(this, port, opt_host);

  /**
   * @type {hsocket.Index}
   */
  this.__index = null;

};

util.inherits(hsocket.WriteChannel, hsocket.Connection);


/**
 * @param {!Array.<(string|number)>} args
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 */
hsocket.WriteChannel.prototype.__sendCommand =
    function(args, complete, cancel) {
  var command = hsocket.expandCommand(args);
  this._send(hsocket.encodeCommand(command),
      new hsocket.PacketHandler(complete, cancel));
};


/**
 * @inheritDoc
 */
hsocket.WriteChannel.prototype.openIndex = function(index, complete, cancel) {
  this.__index = index;
  var command = ['P', index.getId(), index.getDBName(), index.getTableName(),
        index.getName(), index.getColumns().join(',')];
  var fcolumns = index.getFilterColumns();
  if (fcolumns.length) {
    command.push((fcolumns.join(',')));
  }
  this.__sendCommand(command, complete, cancel);
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {string} value Values to fetch.
 * @param {hsocket.ModifyOperationType} mod Condition for modification.
 * @param {!Function} complete Result handler.
 * @param {function(string, number=)} cancel Error handler
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.WriteChannel.prototype.__findModify =
    function(operationType, value, mod, complete, cancel,
             opt_limit, opt_filters) {
  if (this.__index instanceof hsocket.Index) {
    var limit = opt_limit || hsocket.LIMIT();
    var filters = opt_filters || [];
    var command = [this.__index.getId(), operationType, 1, value,
          limit, filters, mod];
    this.__sendCommand(command, complete, cancel);
  } else {
    cancel('(hsocket) Index is not set.');
  }
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {string} value Index column values to fetch.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.WriteChannel.prototype.update =
    function(operationType, value, complete, cancel, opt_limit, opt_filters) {
  this.__findModify(operationType, value, hsocket.ModifyOperationType.UPDATE,
      complete, cancel, opt_limit, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {string} value Values to fetch.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.WriteChannel.prototype.delete =
    function(operationType, value, complete, cancel, opt_limit, opt_filters) {
  this.__findModify(operationType, value, hsocket.ModifyOperationType.DELETE,
      complete, cancel, opt_limit, opt_filters);
};


/**
 * @param {!Array.<string>} values Index column values to set.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 */
hsocket.WriteChannel.prototype.insert = function(values, complete, cancel) {
  if (this.__index instanceof hsocket.Index) {
    if (values.length <= this.__index.getColumns().length) {
      var command = [this.__index.getId(), '+', values.length, values];
      this.__sendCommand(command, complete, cancel);
    } else {
      cancel('(hsocket) Wrong number of values for INSERT.');
    }
  } else {
    cancel('(hsocket) Index is not set.');
  }
};
