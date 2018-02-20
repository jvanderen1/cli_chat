/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 19. 2018 by Grant Savage
 *
 * RoomManager.js
 * 
 * This file contains the class definition for our
 * RoomManager. The RoomManage class contains methods
 * that handle the logic of joining, leaving , and sending
 * messages in specified rooms.
 */

class RoomManager {
	/*
	 * Constructor takes in a Socket instance and 
	 * Log instance.
	 */
	constructor(socket, logger) {
		this.socket = socket;
		this.logger = logger;
	}

	/*
	 * This method essentially binds all the events that need to
	 * be binded for room messaging to the passed in socket instance.
	 */
	handleEvent() {
		/*
		 * This binds a callback to the event used for joining a particular
		 * room. 
		 */
		this.socket.on('join room', (roomName, fn) => {
			/*
			 * Join the specified room.
			 */
			this.socket.join(roomName);

			/*
			 * Log the action
			 */
			this.logger.success(this.socket.id + " joined room " + roomName);

			/*
			 * This acknowledge function essentially sends a message back to the client
			 * acknowleding that the server received the send event. This particular ack
			 * sends the name of the room back to the client.
			 */
			fn(roomName);
		});

		/*
		 * This binds a callback to the event used for leving a particular
		 * room.
		 */
		this.socket.on('leave room', (roomName, fn) => {
			/*
			 * Leave the room.
			 */
			this.socket.leave(roomName);

			/*
			 * Log the action
			 */
			this.logger.error(this.socket.id + " left room " + roomName);

			/*
			 * This acknowledge function essentially sends a message back to the client
			 * acknowleding that the server received the send event. This particular 
			 * ack returns true that the server successully removed the client from 
			 * the room.
			 */
			fn(true);
		});

		/*
		 * This binds a callback to the event used for sending a message to a
		 * particular group.
		 */
		this.socket.on('group message', (roomName, message, fn) => {
			/*
			 * Log the event in the server console.
			 */
			this.logger.info('Received message from ' + this.socket.id + ' with content: ' + message);
			this.logger.info('that will be transmitted to group ' + roomName);

			/*
			 * Transmit the received message payload to the specified socket ID.
			 */
			this.socket.to(roomName).emit('group message', this.socket.id, roomName, message);

			/*
			 * This acknowledge function essentially sends a message back to the client
			 * acknowleding that the server received the send event. This particular ack
			 * sends the message body back to the client.
			 */
			fn(message);
		});
	}
}

/*
 * Export the class.
 */
module.exports = RoomManager;