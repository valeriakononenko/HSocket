


/**
 * @param {number} terminal
 * @param {number} separator
 * @constructor
 */
hsocket.Data = function(terminal, separator) {

  /**
   * @type {Buffer}
   */
  this.__header = null;

  /**
   * @type {Buffer}
   */
  this.__length = null;

  /**
   * @type {Buffer}
   */
  this.__value = null;

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
};


/**
 * @param {!hsocket.Cursor} cursor Индекс курсора.
 * @param {!Buffer} chunk Пакет данных для извлечения значения.
 */
hsocket.Data.prototype.process = function(cursor, chunk) {
  var valueCursor = cursor.getPosition();

  /**
   * @param {number} valueCursor
   * @return {!Buffer}
   */
  function cutData(valueCursor) {
    var data = chunk.slice(cursor.getPosition(), valueCursor);
    valueCursor += 1;
    cursor.incrPosition(valueCursor - cursor.getPosition());
    return data;
  }

  while (valueCursor < chunk.length) {
    var octet = chunk[valueCursor];

    if (octet === this.__separator) {
      if (!this.__header) {
        this.__header = cutData(valueCursor);
        break;
      } else if (!this.__length) {
        this.__length = cutData(valueCursor);
        break;
      }
    }

    if (octet === this.__terminal) {
      this.__isComplete = true;
      if (!this.__length) {
        this.__length = cutData(valueCursor);
      } else {
        this.__value = cutData(valueCursor);
      }
      break;
    }
    valueCursor += 1;
  }
};


/**
 * @return {number}
 */
hsocket.Data.prototype.getHeader = function() {
  return parseInt(this.__header.toString(), 10);
};


/**
 * @return {number}
 */
hsocket.Data.prototype.getLength = function() {
  return parseInt(this.__length.toString(), 10);
};


/**
 * @return {(!Array.<string>|string)}
 */
hsocket.Data.prototype.getValue = function() {



  if (this.__value) {
    var result = [];
    var item = new Buffer(0);
    var self = this;

    for (var j = 0; j < this.__value.length; j++) {
      if (this.__value[j] === 0x09 || this.__value[j] === 0x0a) {
        result.push(item.toString());
        item = new Buffer(0);
      } else {
        item = Buffer.concat([item, new Buffer([this.__value[j]])]);
        if (this.__value.length - j === 1) {
          result.push(item.toString());
        }
      }
    }

    return group();
  }

  return '';
};


/**
 * @return {boolean}
 */
hsocket.Data.prototype.isComplete = function() {
  return this.__isComplete;
};
