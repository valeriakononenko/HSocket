


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
hsocket.Client.prototype.__readCommand =
    function(args, complete, cancel, opt_responseType) {
  var command = hsocket.expandCommand(args);
  this.__readChannel.send(hsocket.encodeCommand(command),
      new hsocket.PacketHandler(complete, cancel, opt_responseType));
};


/**
 * @param {!Array.<(string|number)>} args
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {hsocket.ResponseType=} opt_responseType
 */
hsocket.Client.prototype.__writeCommand =
    function(args, complete, cancel, opt_responseType) {
  var command = hsocket.expandCommand(args);
  console.log(command);
  this.__writeChannel.send(hsocket.encodeCommand(command),
      new hsocket.PacketHandler(complete, cancel, opt_responseType));
};


/**
 * @param {hsocket.ModifyOperationType} modifyOperationType
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {string} value Values to fetch.
 * @param {!Array.<string>} mValues
 * @param {!Function} complete Result handler.
 * @param {function(string, number=)} cancel Error handler.
 * @param {boolean=} opt_asFind Flag indicates the contents of the records
 *    before modification will be returned
 *    instead of number of modified records.
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_in In condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.__findModify =
    function(modifyOperationType, operationType, value, mValues,
             complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  var limit = opt_limit || hsocket.constraints.LIMIT(1, 0);
  var inCondition = opt_in || [];
  var filters = opt_filters || [];
  var mod = hsocket.constraints.MOD(modifyOperationType, mValues, opt_asFind);
  var responseType = opt_asFind ? hsocket.ResponseType.ARRAY :
      hsocket.ResponseType.NUMBER;
  this.find(operationType, value, responseType, complete, cancel,
      limit, inCondition, filters, mod);
};


/**
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 */
hsocket.Client.prototype.auth = function(complete, cancel) {

  /**
   * @param {boolean} status
   */
  function handleAuthorization(status) {
    if (status) {
      complete();
    } else {
      cancel('(hsocket) Authorization error');
    }
  }

  if (this.__authKey) {
    var command = ['A', 1, this.__authKey];
    this.__writeCommand(command, handleAuthorization, cancel);
  } else {
    handleAuthorization(true);
  }
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
  this.__writeCommand(command, complete, cancel);
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {string} value Values to fetch.
 * @param {hsocket.ResponseType} responseType Type of result.
 * @param {!Function} complete Result handler.
 * @param {function(string, number=)} cancel Error handler
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_in In condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 * @param {!Array.<(string|number)>} opt_mod Condition for modification.
 */
hsocket.Client.prototype.find =
    function(operationType, value, responseType, complete, cancel,
             opt_limit, opt_in, opt_filters, opt_mod) {
  if (this.__index instanceof hsocket.Index) {
    var limit = opt_limit || [];
    var inCondition = opt_in || [];
    var filters = opt_filters || [];
    var mod = opt_mod || [];
    var command = [this.__index.getId(), operationType, 1,
                   value, limit, inCondition, filters, mod];
    this.__writeCommand(command, complete, cancel, responseType);
  } else {
    cancel('(hsocket) Index is not set.');
  }
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {!Array.<string>} values Index column values to fetch.
 * @param {!Array.<string>} mValues Index column values to modify.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind Flag indicates the contents of the records
 *    before modification will be returned
 *    instead of number of modified records.
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_in In condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.update =
    function(operationType, values, mValues, complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  this.__findModify(hsocket.ModifyOperationType.UPDATE, operationType,
      values, mValues, complete, cancel,
      opt_asFind, opt_limit, opt_in, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {!Array.<string>} values Index column values to fetch.
 * @param {!Array.<string>} mValues Index column values to modify.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_in In condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.increment =
    function(operationType, values, mValues, complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  this.__findModify(hsocket.ModifyOperationType.INCREMENT, operationType,
      values, mValues, complete, cancel,
      opt_asFind, opt_limit, opt_in, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {!Array.<string>} values Index column values to fetch.
 * @param {!Array.<string>} mValues Index column values to modify.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_in In condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.decrement =
    function(operationType, values, mValues, complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  this.__findModify(hsocket.ModifyOperationType.DECREMENT, operationType,
      values, mValues, complete, cancel,
      opt_asFind, opt_limit, opt_in, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType Comparison operation.
 * @param {!Array.<string>} values Index column values to fetch.
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<(string|number)>=} opt_limit Limit condition.
 * @param {!Array.<(string|number)>=} opt_in In condition.
 * @param {!Array.<(string|number)>=} opt_filters Filters for result.
 */
hsocket.Client.prototype.delete =
    function(operationType, values, complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  this.__findModify(hsocket.ModifyOperationType.DELETE, operationType,
      values, [], complete, cancel,
      opt_asFind, opt_limit, opt_in, opt_filters);
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
      this.__writeCommand(command, complete, cancel);
    } else {
      cancel('(hsocket) Wrong number of values for INSERT.');
    }
  } else {
    cancel('(hsocket) Index is not set.');
  }
};
