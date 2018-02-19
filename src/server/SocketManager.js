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

class SocketManager {
	/*
	 * Constructor takes in instance of socket.io class
	 */
	constructor(io) {
		this.io = io;
	}

	/*
	 * This method takes in a string for a socket event
	 * and callback to execute.
	 */
	on(event, callback) {
		this.io.on(event, callback);
	}
}

/*
 * Export the SocketManager class
 */
module.exports = SocketManager