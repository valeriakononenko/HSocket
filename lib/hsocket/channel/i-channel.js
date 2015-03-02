


/**
 * @interface
 */
hsocket.channel.IChannel = function() {};


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {!hsocket.Index} index
 */
hsocket.channel.IChannel.prototype.openIndex =
    function(complete, cancel, index) {};


/**
 * @param {!hsocket.Handler} complete
 * @param {!hsocket.Handler} cancel
 * @param {string} akey
 */
hsocket.channel.IChannel.prototype.auth = function(complete, cancel, akey) {};
