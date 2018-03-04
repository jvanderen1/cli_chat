/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 19. 2018 by Grant Savage
 *
 * Room.js
 * 
 * This file contains the class definition for our
 * RoomManager. The RoomManage class contains methods
 * that handle the logic of joining, leaving , and sending
 * messages in specified rooms.
 */

module.exports = class GroupMessage {
  /*
   * Constructor takes in a Socket instance and
   * Log instance.
   */
  constructor(socket, logger) {
    this.socket = socket;
    this.logger = logger;
    this.handlers = {
      groupMessage: this.groupMessage.bind(this)
    };
  }

  /*
   * This binds a callback to the event used for sending a message to a
   * particular group.
   */
  groupMessage(roomName, message, ack) {
    /*
     * Log the event in the server console.
     */
    this.logger.info(['Received message from', this.socket.id, 'with content:', message,
      'that will be transmitted to group', roomName].join(' '));

    /*
     * Transmit the received message payload to the specified socket ID.
     */
    this.socket.to(roomName).
        emit('groupMessage', this.socket.id, roomName, message);

    /*
     * This acknowledge function essentially sends a message back to the client
     * acknowledging that the server received the send event. This particular ack
     * sends the message body back to the client.
     */
    ack(message);
  }
}