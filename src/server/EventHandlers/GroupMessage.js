/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: April 30. 2018
 *
 * GroupMessage.js
 * 
 * This file contains the class definition for our
 * GroupMessage class. This class is responseible for
 * defining the methods that are used in group messaging. 
 */

class GroupMessage {
  
  /**
   * Explicit constructor takes in a Socket instance and
   * Log instance.
   */
  constructor(socket, logger) {
    this.socket = socket;
    this.logger = logger;

    /**
     * Create a map of event handlers to be used during the
     * handler binding process to a socket. We call the bind
     * method on each handler method in this class to tell
     * the interpreter what the "this" keyword refers to.
     */
    this.handlers = {
      groupMessage: this.groupMessage.bind(this) 
    };
  }

  /**
   * This binds a callback to the event used for sending a message to a
   * particular group.
   */
  groupMessage(roomName, message, ack) {
    /**
     * Log the event in the server console.
     */
    this.logger.info(['Received message from', this.socket.id, 'with content:', message,
      'that will be transmitted to group', roomName].join(' '));

    /**
     * Transmit the received message payload to the specified socket ID.
     * The "to" method is internal to the socket.io socket instance and
     * directs the message to a specific room.
     */
    this.socket.to(roomName).
        emit('groupMessage', this.socket.id, roomName, message);

    /**
     * This acknowledge function essentially sends a message back to the client
     * acknowledging that the server received the send event. This particular ack
     * sends the message body back to the client.
     */
    ack(message);
  }
}

/**
 * Exports class for usage.
 */
module.exports = GroupMessage;