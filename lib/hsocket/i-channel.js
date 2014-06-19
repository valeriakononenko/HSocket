


/**
 * @interface
 */
hsocket.IChannel = function() {};


/**
 * @param {!hsocket.Index} index
 * @param {!Function} complete Result handler
 * @param {function(string, number=)} cancel Error handler
 */
hsocket.IChannel.prototype.openIndex = function(index, complete, cancel) {};
