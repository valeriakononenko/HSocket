


/**
 * @param {string} dbName
 * @param {string} tableName
 * @param {!Array.<string>} columns
 * @param {string=} opt_indexName
 * @param {number=} opt_indexId
 * @param {!Array.<string>=} opt_filterColumns
 * @constructor
 */
hsocket.Index = function(dbName, tableName, columns,
                         opt_indexName, opt_indexId, opt_filterColumns) {

  /**
   * @type {number}
   */
  this.__indexId = opt_indexId || 0;

  /**
   * @type {string}
   */
  this.__indexName = opt_indexName || 'PRIMARY';

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

  /**
   * @type {*}
   */
  this.__indexData = null;

};


/**
 * @return {number}
 */
hsocket.Index.prototype.getId = function() {
  return this.__indexId;
};


/**
 * @return {string}
 */
hsocket.Index.prototype.getName = function() {
  return this.__indexName;
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


/**
 * @return {*}
 */
hsocket.Index.prototype.getIndexData = function() {
  return this.__indexData;
};


/**
 * @param {*} data
 */
hsocket.Index.prototype.setIndexData = function(data) {
  this.__indexData = data;
};
