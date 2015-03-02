


/**
 * @param {number} id
 * @param {string} name
 * @param {string} dbName
 * @param {string} tableName
 * @param {!Array.<string>} columns
 * @param {!Array.<string>=} opt_filterColumns
 * @constructor
 */
hsocket.Index = function(id, name, dbName, tableName, columns,
                         opt_filterColumns) {

  /**
   * @type {number}
   */
  this.__id = id;

  /**
   * @type {string}
   */
  this.__name = name;

  /**
   * @type {string}
   */
  this.__dbName = dbName;

  /**
   * @type {string}
   */
  this.__tableName = tableName;

  /**
   * @type {!Array.<string>}
   */
  this.__columns = columns;

  /**
   * @type {!Array.<string>}
   */
  this.__fcolumns = opt_filterColumns || [];

};


/**
 * @return {number}
 */
hsocket.Index.prototype.getId = function() {
  return this.__id;
};


/**
 * @return {string}
 */
hsocket.Index.prototype.getName = function() {
  return this.__name;
};


/**
 * @return {string}
 */
hsocket.Index.prototype.getDBName = function() {
  return this.__dbName;
};


/**
 * @return {string}
 */
hsocket.Index.prototype.getTableName = function() {
  return this.__tableName;
};


/**
 * @return {!Array.<string>}
 */
hsocket.Index.prototype.getColumns = function() {
  return this.__columns;
};


/**
 * @return {!Array.<string>}
 */
hsocket.Index.prototype.getFilterColumns = function() {
  return this.__fcolumns;
};
