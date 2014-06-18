


/**
 *
 * @param {number} readPort
 * @param {number} writePort
 * @param {string=} opt_host
 * @param {string=} opt_authKey
 * @constructor
 */
hsocket.Client = function(readPort, writePort, opt_host, opt_authKey) {

  /**
   * @type {!hsocket.Connection}
   */
  this.__readChannel = new hsocket.Connection(readPort, opt_host);

  /**
   * @type {!hsocket.Connection}
   */
  this.__writeChannel = new hsocket.Connection(writePort, opt_host);

  /**
   * @type {string}
   */
  this.__authKey = opt_authKey || '';

  /**
   * @type {hsocket.Index}
   */
  this.__index = null;

};


/**
 * @param {!Array.<(string|number)>} args
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {hsocket.ResponseType=} opt_responseType
 */
hsocket.Client.prototype.__sendCommand =
    function(args, complete, cancel, opt_responseType) {
  var command = hsocket.expandCommand(args);
  this.__writeChannel.send(hsocket.encodeCommand(command),
      new hsocket.PacketHandler(complete, cancel, opt_responseType));
};


/**
 * @param {!hsocket.Index} index
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 */
hsocket.Client.prototype.openIndex = function(index, complete, cancel) {
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
 * @param {!Array.<(string|number)>} mod Condition for modification.
 * @param {hsocket.ResponseType} responseType Type of result.
 * @param {!Function} complete Result handler.
 * @param {function(string, number=)} cancel Error handler
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.__findModify =
    function(operationType, value, mod, responseType, complete, cancel,
             opt_limit, opt_filters) {
  if (this.__index instanceof hsocket.Index) {
    var limit = opt_limit || [1, 0];
    var filters = opt_filters || [];
    var command = [this.__index.getId(), operationType, 1,
                   value, limit, filters, mod];
    this.__sendCommand(command, complete, cancel, responseType);
  } else {
    cancel('(hsocket) Index is not set.');
  }
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {string} value Values to fetch.
 * @param {!Function} complete Result handler.
 * @param {function(string, number=)} cancel Error handler
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.find = function(operationType, value, complete, cancel,
                                         opt_limit, opt_filters) {
  this.__findModify(operationType, value, [], hsocket.ResponseType.ARRAY,
      complete, cancel, opt_limit, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {string} value Index column values to fetch.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.update =
    function(operationType, value, complete, cancel, 
             opt_asFind, opt_limit, opt_filters) {
  var responseType = (opt_asFind || false) ? hsocket.ResponseType.ARRAY :
      hsocket.ResponseType.NUMBER;
  var mod = (opt_asFind || false) ? hsocket.ModifyOperationType.UPDATE + '?' :
      hsocket.ModifyOperationType.UPDATE;
  this.__findModify(operationType, value, responseType, complete, cancel, mod,
      opt_limit, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {string} value Values to fetch.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.delete =
    function(operationType, value, complete, cancel, 
             opt_asFind, opt_limit, opt_filters) {
  var responseType = (opt_asFind || false) ? hsocket.ResponseType.ARRAY :
      hsocket.ResponseType.NUMBER;
  var mod = (opt_asFind || false) ? hsocket.ModifyOperationType.DELETE + '?' :
      hsocket.ModifyOperationType.DELETE;
  this.__findModify(operationType, value, responseType, complete, cancel, mod,
      opt_limit, opt_filters);
};


/**
 * @param {!Array.<string>} values Index column values to set.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 */
hsocket.Client.prototype.insert = function(values, complete, cancel) {
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
