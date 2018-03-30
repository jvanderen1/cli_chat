/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 19. 2018 by Grant Savage
 *
 * SocketManager.js
 * 
 * This file contains the class definition for our
 * SocketManager. The SocketManager class takes in
 * an instance of a socket.io class and essentially
 * abstracts out our web socket interface so that we
 * can easily switch implementations if needed.
 */

module.exports = class SocketManager {
	/*
	 * Constructor takes in instance of socket.io class
	 */
	constructor(io) {
		this.io = io;
		this.users = [];
 	  	this.rooms = [];
	}

	/*
	 * This method takes in a string for a socket event
	 * and callback to execute.
	 */
	on(event, callback) {
		this.io.on(event, callback);
	}

	/*
	 * This method takes in a string for a socket event
	 * and any multiple of arguments for data transmission.
	 */
	emit(event, ...args) {
		this.io.emit(event, args);
	}

	/*
	 * This method gets the IDs of the currently connected
	 * sockets and sets them equal to the users property 
	 * of the SocketManager instance.
	 */
	connectedUsers() {
		return this.users = Object.keys(this.io.of('/').connected);
	}

	/*
	 * Log and send out an event to all users with the updated
	 * list of connected users.
	 */
	updateUsers() {
		this.emit('users', this.connectedUsers());
	}
 
  	/*
   	*
   	*/
  	createdRooms() {
    	var availableRooms = [];
    	var rooms = this.io.sockets.adapter.rooms;
    	if (rooms) {
      		for (var room in rooms) {
       			if (!rooms[room].hasOwnProperty(room)) {
          			availableRooms.push(room);
        		}
      		}
    	}
    
    	this.rooms = availableRooms.filter((el) => !this.users.includes(el));
    
    	return this.rooms;
  }
  
  /*
   *
   */
  updateRooms() {
    this.emit('rooms', this.createdRooms());
  }
}