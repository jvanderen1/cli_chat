/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: April 1. 2018
 *
 * Room.js
 * 
 * This file contains the class definition for our
 * RoomManager. The RoomManage class contains methods
 * that handle the logic of joining, leaving , and sending
 * messages in specified rooms.
 */

class Room {

  /**
   * Constructor takes in a Socket instance and
   * Log instance.
   */
  constructor(socket, logger, socketManager) {
    this.socket = socket;
    this.logger = logger;
    this.socketManager = socketManager;
    this.handlers = {
      joinRoom: this.joinRoom.bind(this),
      leaveRoom: this.leaveRoom.bind(this),
      updateUsers: this.updateUsers.bind(this),
      nickname: this.nickname.bind(this)
    };
  }

  /**
   * This binds the callback to the even used for 
   * registering a nickname with the system.
   */
  nickname(nickname, ack) {
    /**
     * Create an object with the socket id and selected nickname
     */

    let user = {
      id: this.socket.id,
      nickname: nickname
    };

    // TODO Error checking and existing username checking

    /**
     * Push the new user onto the current users array.
     */
    this.socketManager.users.push(user);

    /**
     * Log the nickname registration event
     */
    this.logger.info([user.nickname, ' registered as a nickname.'].join(' '));

    /**
     * Send out the updated list of online users
     */
    this.socketManager.updateUsers();

    /**
     * Call the acknowledge callback and pass the nickname
     */
    ack(nickname);
  }

  /**
   * This binds a callback to the event used for joining a particular
   * room.
   */
  joinRoom(roomName, ack) {
    /**
     * Join the specified room.
     */
    this.socket.join(roomName);

    /**
     * Log the action.
     */
    this.logger.success([this.socket.id, 'joined room', roomName].join(' '));
    
    /**
     * Update the list of created rooms.
     */
    this.socketManager.updateRooms();

    /**
     * This acknowledge function essentially sends a message back to the client
     * acknowledging that the server received the send event. This particular ack
     * sends the name of the room back to the client.
     */
    ack(roomName);
  }

  /**
   * This binds a callback to the event used for leving a particular
   * room.
   */
  leaveRoom(roomName, ack) {
    /**
     * Leave the room.
     */
    this.socket.leave(roomName);

    /**
     * Log the action.
     */
    this.logger.error([this.socket.id, 'left room', roomName].join(' '));
    
    /**
     * Update the list of created rooms.
     */
    this.socketManager.updateRooms();

    /**
     * This acknowledge function essentially sends a message back to the client
     * acknowledging that the server received the send event. This particular
     * ack returns true that the server successfully removed the client from
     * the room.
     */
    ack(roomName);
  }

  /**
   * Update the list of connected users.
   */
  updateUsers() {
    this.socketManager.updateUsers();
  }
}

/**
 * Exports class for usage.
 */
module.exports = Room;