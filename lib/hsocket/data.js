


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
 * @param {!hsocket.Cursor} cursor Индекс курсора.
 * @param {!Buffer} chunk Пакет данных для извлечения значения.
 */
hsocket.Data.prototype.process = function(cursor, chunk) {
  var valueCursor = cursor.getPosition();

  console.log('CH:', chunk);

  /**
   * @return {!Buffer}
   */
  function cutData() {
    var data = chunk.slice(cursor.getPosition(), valueCursor);
    cursor.incrPosition(valueCursor - cursor.getPosition() + 1);
    return data;
  }

  while (valueCursor < chunk.length) {
    var octet = chunk[valueCursor];

    if (octet === this.__separator) {
      if (!this.__hasHeader) {
        this.__header = parseInt(cutData().toString(), 10);
        this.__hasHeader = true;
        console.log('HS:', this.__header);
      } else if (!this.__hasLength) {
        this.__length = parseInt(cutData().toString(), 10);
        this.__hasLength = true;
        console.log('LS:', this.__length);
      }
    }

    if (octet === this.__terminal) {
      this.__isComplete = true;
      if (!this.__hasLength) {
        this.__length = parseInt(cutData().toString(), 10);
        this.__hasLength = true;
        console.log('LT:', this.__length);
      } else {
        this.__value = hsocket.decodeResponse(cutData(),
            this.__length, this.__separator);
        console.log('VT:', this.__value);
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
