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

module.exports = class Room {
  /*
   * Constructor takes in a Socket instance and
   * Log instance.
   */
  constructor(socket, logger) {
    this.socket = socket;
    this.logger = logger;
    this.handlers = {
      joinRoom: this.joinRoom.bind(this),
      leaveRoom: this.leaveRoom.bind(this),
    };
  }

  /*
   * This binds a callback to the event used for joining a particular
   * room.
   */
  joinRoom(roomName, ack) {
    /*
     * Join the specified room.
     */
    this.socket.join(roomName);

    /*
     * Log the action
     */
    this.logger.success([this.socket.id, 'joined room', roomName].join(' '));

    /*
     * This acknowledge function essentially sends a message back to the client
     * acknowledging that the server received the send event. This particular ack
     * sends the name of the room back to the client.
     */
    ack(roomName);
  }

  /*
   * This binds a callback to the event used for leving a particular
   * room.
   */
  leaveRoom(roomName, ack) {
    /*
     * Leave the room.
     */
    this.socket.leave(roomName);

    /*
     * Log the action
     */
    this.logger.error([this.socket.id, 'left room', roomName].join(' '));

    /*
     * This acknowledge function essentially sends a message back to the client
     * acknowledging that the server received the send event. This particular
     * ack returns true that the server successfully removed the client from
     * the room.
     */
    ack(true);
  }
}