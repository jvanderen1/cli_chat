/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: April 30. 2018
 *
 * SocketManager.js
 * 
 * This file contains the class definition for our
 * SocketManager. The SocketManager class takes in
 * an instance of a socket.io class and essentially
 * abstracts out our web socket interface so that we
 * can easily switch implementations if needed.
 */

class SocketManager {

	/**
	 * Constructor takes in instance of socket.io class
	 */
	constructor(io) {
    this.io = io;
    this.users = [];
    this.rooms = [];
	}

	/**
	 * This method takes in a string for a socket event
	 * and callback to execute.
	 */
	on(event, callback) {
		this.io.on(event, callback);
	}

	/**
	 * This method takes in a string for a socket event
	 * and any multiple of arguments for data transmission.
	 * ..args is a variadic argument
	 */
	emit(event, ...args) {
		this.io.emit(event, args);
	}

	/**
	 * Send out an event to all users with the updated
	 * list of connected users.
	 */
	updateUsers() {
		this.emit('users', this.users);
	}
 
  	/**
 	 * Get a list of all created rooms
 	 */
 	createdRooms() {
		/**
		 * Create temporary array of rooms
		 */
		let availableRooms = [];

		/**
		 * Get list of available rooms. Unfortunately 
		 * the list of rooms returned from the socket
		 * library includes is in an odd structure.
		 */
		let rooms = this.io.sockets.adapter.rooms;

		/**
		 * To remove get the rooms in a simple array,
		 * loop through the rooms and only push the name
		 * of the room to the avaiable rooms array.
		 */
		for (let room in rooms) {
			if (!rooms[room].hasOwnProperty(room)) {
				availableRooms.push(room);
			}
		}

		/**
		 * Reset rooms to an empty array
		 */
		rooms = [];

		/**
		 * Unfortunately the list of rooms also contains 
		 * the currently connected users. 
		 */
		let users = Object.keys(this.io.sockets.sockets);

		/**
		 * Filter the users out of the list of rooms by checking
		 * if each element is 
		 */
		availableRooms.forEach((room) => {
			if (!users.includes(room)) {
				rooms.push(room);
			}
		});

		/**
		 * Set the rooms property equal to the filtered
		 * list of rooms and also return the value for
		 * use.
		 */	
		return this.rooms = rooms;
	}
  
  /**
   * Send out an event to all users with the updated
   * list of created rooms.
   */
  updateRooms() {
    this.emit('rooms', this.createdRooms());
  }

  /**
   * Remove a user from the current users array
   */
  removeUser(id) {
  	/**
  	 * Get the user by ID
  	 */
  	let user = this.users.find(u => u.id === id);
  	/**
  	 * Remove the user from the users array.
  	 */
  	this.users.splice(this.users.indexOf(user),1);

  	/**
  	 * Send out the list of updated users.
  	 */
  	this.updateUsers();
  }
}

/**
 * Exports class for usage.
 */
module.exports = SocketManager;