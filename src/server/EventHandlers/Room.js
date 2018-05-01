/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: April 30. 2018
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
   * Explicit constructor takes in a Socket instance,
   * Log instance, and socketManager instance. We need
   * the sokcketManager instance to update the list of
   * users.
   */
  constructor(socket, logger, socketManager) {
    this.socket = socket;
    this.logger = logger;
    this.socketManager = socketManager;

    /**
     * Create a map of event handlers to be used during the
     * handler binding process to a socket. We call the bind
     * method on each handler method in this class to tell
     * the interpreter what the "this" keyword refers to.
     */
    this.handlers = {
      joinRoom: this.joinRoom.bind(this),
      leaveRoom: this.leaveRoom.bind(this),
      nickname: this.nickname.bind(this)
    };
  }

  /**
   * Method for registering a user when they create
   * a nickname.
   */
  nickname(nickname, ack) {
    /**
     * Create an object with the socket id and selected nickname.
     * This allows us to associate a nickname with a socket ID.
     */
    let user = {
      id: this.socket.id,
      nickname: nickname
    };

    /**
     * Push the new user onto the current users array stored
     * in the SocketManager instance.
     */
    this.socketManager.users.push(user);

    /**
     * Log the nickname registration event.
     */
    this.logger.info([user.nickname, ' registered as a nickname.'].join(' '));

    /**
     * Send out the updated list of online users.
     */
    this.socketManager.updateUsers();

    /**
     * Also send out the updated list of rooms.
     */
    this.socketManager.updateRooms();

    /**
     * Call the acknowledge callback and pass the nickname.
     */
    ack(nickname);
  }

  /**
   * Method for handling when a user joins a room.
   */
  joinRoom(roomName, ack) {
    /**
     * Join the specified room. The join method is internal to the socket.io
     * socket instance.
     */
    this.socket.join(roomName);

    /**
     * Log the join room action.
     */
    this.logger.success([this.socket.id, 'joined room', roomName].join(' '));
    
    /**
     * Send out the list of created rooms.
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
   * Method for handling when a user leaves a room.
   */
  leaveRoom(roomName, ack) {
    /**
     * Leave the room. The leave method is internal to the socket.io
     * socket instance.
     */
    this.socket.leave(roomName);

    /**
     * Log the leave room action.
     */
    this.logger.info([this.socket.id, 'left room', roomName].join(' '));
    
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
}

/**
 * Exports class for usage.
 */
module.exports = Room;