


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
 * @param {hsocket.ResponseType=} opt_type
 * @return {*}
 */
hsocket.Data.prototype.getValue = function(opt_type) {
  var valueType = opt_type || hsocket.ResponseType.EMPTY;

  if (this.__value) {
    console.log('RAW', this.__value);
  }

  if (this.__value) {
    switch (valueType) {
      case hsocket.ResponseType.ARRAY: {
        return this.__getArray();
      }

      case hsocket.ResponseType.NUMBER: {
        return this.__getNumber();
      }
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
 * @return {!Array.<string>}
 */
hsocket.Data.prototype.__getArray = function() {
  var result = [];
  var item = new Buffer(0);
  var self = this;

  /**
   * @return {!Array.<(string|!Array.<string>)>}
   */
  function group() {
    var groups = [];
    var group = [];
    var i = 0;
    var l = self.getLength();

    while (i < result.length) {
      if ((i % l === 0) && i) {
        groups.push(group);
        group = [];
      }

      group.push(result[i]);

      if (result.length - i === 1) {
        groups.push(group);
      }

      i += 1;
    }

    if (groups.length === 1) {
      return groups[0];
    }

    return groups;
  }


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
};


/**
 * @return {boolean}
 */
hsocket.Data.prototype.isComplete = function() {
  return this.__isComplete;
};
