


/**
 * @param {number} terminal
 * @param {number} separator
 * @constructor
 */
hsocket.Data = function(terminal, separator) {

  /**
   * @type {number}
   */
  this.__header = -1;

  /**
   * @type {number}
   */
  this.__length = 0;

  /**
   * @type {(string|!Array.<string>)}
   */
  this.__value = '';

  /**
   * @type {number}
   */
  this.__separator = separator;

  /**
   * @type {number}
   */
  this.__terminal = terminal;

  /**
   * @type {boolean}
   */
  this.__isComplete = false;

  /**
   * @type {boolean}
   */
  this.__hasHeader = false;

  /**
   * @type {boolean}
   */
  this.__hasLength = false;

};


/**
 * @param {!hsocket.Cursor} cursor
 * @param {!Buffer} chunk
 */
hsocket.Data.prototype.process = function(cursor, chunk) {
  var dataCursor = cursor.getPosition();

  /**
   * @return {!Buffer}
   */
  function cutData() {
    var data = chunk.slice(cursor.getPosition(), dataCursor);
    cursor.incrPosition(dataCursor - cursor.getPosition() + 1);
    return data;
  }

  while (dataCursor < chunk.length) {
    var octet = chunk[dataCursor];

    if (octet === this.__separator) {
      if (!this.__hasHeader) {
        this.__header = parseInt(cutData().toString(), 10);
        this.__hasHeader = true;
      } else if (!this.__hasLength) {
        this.__length = parseInt(cutData().toString(), 10);
        this.__hasLength = true;
      }
    }

    if (octet === this.__terminal) {
      if (!this.__hasLength) {
        this.__length = parseInt(cutData().toString(), 10);
        this.__hasLength = true;
      } else {
        this.__value = hsocket.decodeResponse(cutData(),
            this.__length, this.__separator);
      }
      this.__isComplete = true;
      break;
    }

    dataCursor += 1;
  }
};


/**
 * @return {number}
 */
hsocket.Data.prototype.getHeader = function() {
  return this.__header;
};


/**
 * @return {(!Array.<string>|string)}
 */
hsocket.Data.prototype.getValue = function() {
  return this.__value;
};


/**
 * @return {boolean}
 */
hsocket.Data.prototype.isComplete = function() {
  return this.__isComplete;
};
