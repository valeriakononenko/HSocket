


/**
 * @param {!Function} complete Result handler.
 * @param {function(string, number=)} cancel Error handler.
 * @constructor
 */
hsocket.PacketHandler = function(parser, complete, cancel, opt_type) {

  var self = this;

  /**
   * @type {!Buffer}
   */
  this.__input = new Buffer(0);

  /**
   * @type {number}
   */
  this.__header = 0;

  /**
   * @type {number}
   */
  this.__length = 0;

  /**
   * @type {*}
   */
  this.__data = null;

  /**
   * @type {boolean}
   */
  this.__isComplete = false;

  this.__type = opt_type || hsocket.DataType.STRING;

  /**
   *
   */
  this.__handleSuccess = function() {
    complete(parser.get(self.__data, self.__type));
  };

  /**
   *
   */
  this.__handleError = function() {
    cancel(self.__data, self.__header);
  }

};



/**
 * @inheritDoc
 */
hsocket.PacketHandler.prototype.process = function(chunk) {

  this.__input = this.__input.concat([chunk]);

  if (this.__input[this.__input.length - 1] === this.__parser.getTerminal()) {
    this.__isComplete = true;
    if (this.isError()) {
      process.nextTick(this.__handleError);
    } else {
      process.nextTick(this.__handleSuccess);
    }
  }

  return this.__isComplete;
};


/**
 * @inheritDoc
 */
hsocket.PacketHandler.prototype.reset = function() {
  this.__data = new Buffer(0);
};


/**
 * @return {boolean}
 */
hsocket.PacketHandler.prototype.isError = function() {
  return this.__header !== 0;
};


hsocket.PacketHandler.prototype.__parseInput = function() {
  var separatorCounter = 0;

};
