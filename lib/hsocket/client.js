


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
 * @param {!Array.<?(string|number)>} args
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {hsocket.RequestType=} opt_requestType
 */
hsocket.Client.prototype.__readCommand =
    function(args, complete, cancel, opt_requestType) {
  var command = hsocket.encodeCommand(args);
  this.__readChannel.send(command,
      new hsocket.PacketHandler(complete, cancel, opt_requestType));
};


/**
 * @param {!Array.<?(string|number)>} args
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {hsocket.RequestType=} opt_requestType
 */
hsocket.Client.prototype.__writeCommand =
    function(args, complete, cancel, opt_requestType) {
  var command = hsocket.encodeCommand(args);
  this.__writeChannel.send(command,
      new hsocket.PacketHandler(complete, cancel, opt_requestType));
};


/**
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 */
hsocket.Client.prototype.__auth = function(complete, cancel) {

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
 * @param {hsocket.OperationType} operationType
 * @param {!Array.<string>} columns
 * @param {!Array.<?(string|number)>} mod
 * @param {hsocket.RequestType} requestType
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {!Array.<?(string|number)>=} opt_limit
 * @param {!Array.<?(string|number)>=} opt_in
 * @param {!Array.<?(string|number)>=} opt_filters
 */
hsocket.Client.prototype.__findModify =
    function(operationType, columns, mod, requestType, complete, cancel,
             opt_limit, opt_in, opt_filters) {

  if (this.__index instanceof hsocket.Index) {
    var args = [this.__index.getId(), operationType, columns.join(',')];

    var limit = opt_limit || [];
    var inCondition = opt_in || [];
    var filters = opt_filters || [];

    args.concat(limit);
    args.concat(inCondition);

    for (var i = 0; i < filters.length; i++) {
      args.concat(filters[i]);
    }

    args.concat(mod);

    var command = hsocket.encodeCommand(args);

    this.__writeChannel.send(command,
        new hsocket.PacketHandler(complete, cancel, requestType));
  } else {
    cancel('(hsocket) Index is not set.');
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
  this.__writeCommand(command, complete, cancel);
};


/**
 * @param {hsocket.OperationType} operationType
 * @param {!Array.<string>} values
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {!Array.<?(string|number)>=} opt_limit
 * @param {!Array.<?(string|number)>=} opt_in
 * @param {!Array.<?(string|number)>=} opt_filters
 */
hsocket.Client.prototype.find =
    function(operationType, values, complete, cancel,
             opt_limit, opt_in, opt_filters) {
  var limit = opt_limit || [];
  var inCondition = opt_in || [];
  var filters = opt_filters || [];

  if (this.__index instanceof hsocket.Index) {
    var command = [this.__index.getId(), operationType, values.length,
                   values.join(',')];
    command.concat(limit);
    command.concat(inCondition);
    command.concat(filters);
    this.__readCommand(command, complete, cancel, hsocket.RequestType.ARRAY);
  } else {
    cancel('(hsocket) Index is not set.');
  }
};


/**
 * @param {hsocket.OperationType} operationType
 * @param {!Array.<string>} columns
 * @param {!Array.<string>} values
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<?(string|number)>=} opt_limit
 * @param {!Array.<?(string|number)>=} opt_in
 * @param {!Array.<?(string|number)>=} opt_filters
 */
hsocket.Client.prototype.update =
    function(operationType, columns, values, complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  var mod = hsocket.constraints.MOD(hsocket.ModifyOperationType.UPDATE,
      values, opt_asFind);
  var requestType = opt_asFind ? hsocket.RequestType.ARRAY :
      hsocket.RequestType.NUMBER;
  this.__findModify(operationType, columns, mod, requestType, complete, cancel,
      opt_limit, opt_in, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType
 * @param {!Array.<string>} columns
 * @param {!Array.<string>} values
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<?(string|number)>=} opt_limit
 * @param {!Array.<?(string|number)>=} opt_in
 * @param {!Array.<?(string|number)>=} opt_filters
 */
hsocket.Client.prototype.increment =
    function(operationType, columns, values, complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  var mod = hsocket.constraints.MOD(hsocket.ModifyOperationType.INCREMENT,
      values, opt_asFind);
  var requestType = opt_asFind ? hsocket.RequestType.ARRAY :
      hsocket.RequestType.NUMBER;
  this.__findModify(operationType, columns, mod, requestType, complete, cancel,
      opt_limit, opt_in, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType
 * @param {!Array.<string>} columns
 * @param {!Array.<string>} values
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<?(string|number)>=} opt_limit
 * @param {!Array.<?(string|number)>=} opt_in
 * @param {!Array.<?(string|number)>=} opt_filters
 */
hsocket.Client.prototype.decrement =
    function(operationType, columns, values, complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  var mod = hsocket.constraints.MOD(hsocket.ModifyOperationType.DECREMENT,
      values, opt_asFind);
  var requestType = opt_asFind ? hsocket.RequestType.ARRAY :
      hsocket.RequestType.NUMBER;
  this.__findModify(operationType, columns, mod, requestType, complete, cancel,
      opt_limit, opt_in, opt_filters);
};


/**
 * @param {hsocket.OperationType} operationType
 * @param {!Array.<string>} columns
 * @param {!Array.<string>} values
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 * @param {boolean=} opt_asFind
 * @param {!Array.<?(string|number)>=} opt_limit
 * @param {!Array.<?(string|number)>=} opt_in
 * @param {!Array.<?(string|number)>=} opt_filters
 */
hsocket.Client.prototype.delete =
    function(operationType, columns, values, complete, cancel,
             opt_asFind, opt_limit, opt_in, opt_filters) {
  var mod = hsocket.constraints.MOD(hsocket.ModifyOperationType.DELETE, values,
      opt_asFind);
  var requestType = opt_asFind ? hsocket.RequestType.ARRAY :
      hsocket.RequestType.NUMBER;
  this.__findModify(operationType, columns, mod, requestType, complete, cancel,
      opt_limit, opt_in, opt_filters);
};


/**
 * @param {!Array.<string>} values
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 */
hsocket.Client.prototype.insert = function(values, complete, cancel) {
  if (this.__index instanceof hsocket.Index) {
    var command = [this.__index.getId(), '+', values.length.toString(),
      values.join(',')];
    this.__writeCommand(command, complete, cancel);
  } else {
    cancel('(hsocket) Index is not set.');
  }
};
