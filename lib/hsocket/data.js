


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
 * @param {hsocket.Cursor} cursor Индекс курсора.
 * @param {Buffer} chunk Пакет данных для извлечения значения.
 */
hsocket.Data.prototype.process = function(cursor, chunk) {
  var valueCursor = cursor.getPosition();

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
 * @param {hsocket.RequestType=} opt_type
 * @return {*}
 */
hsocket.Data.prototype.getValue = function(opt_type) {
  //  console.log('RAW:', this.__value);
  //  if (this.__value) {
  //    console.log('ARRAY:', this.__getArray());
  //  }

  var valueType = opt_type || hsocket.RequestType.EMPTY;

  switch (valueType) {
    case hsocket.RequestType.ARRAY: {
      return this.__getArray();
    }

    case hsocket.RequestType.NUMBER: {
      return this.__getNumber();

    }
  }

  return '';
};


/**
 * @return {number}
 */
hsocket.Data.prototype.__getNumber = function() {
  return parseInt(this.__value.toString(), 10);
};


/**
 * @return {Array.<*>}
 */
hsocket.Data.prototype.__getArray = function() {
  var result = [];

  var i = 0;
  var l = this.__value.length;
  var start = 0;


  while ((result.length < this.getLength()) && (i <= l)) {
    if ((this.__value[i] === this.__separator) || (i == l)) {
      var item = this.__value.slice(start, i);
      result.push(item.toString());
      start = i + 1;
    }
    i += 1;
  }

  return result;
};


/**
 * @return {boolean}
 */
hsocket.Data.prototype.isComplete = function() {
  return this.__isComplete;
};
