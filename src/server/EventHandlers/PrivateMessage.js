/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 19. 2018 by Grant Savage
 *
 * PrivateMessage.js
 * 
 * This file contains the class definition for our
 * PrivateMessageManager. The PrivateMessageManager
 * class contains the methods that handle the logic
 * for sending peer to peer messages between clients.
 */

module.exports = class PrivateMessage {
	/*
	 * Constructor takes in a Socket instance and 
	 * Log instance.
	 */
	constructor(socket, logger) {
		this.socket = socket;
		this.logger = logger;
		this.handlers = {
			privateMessage: this.privateMessage.bind(this)
		}
	}

	/*
	 * This method essentially binds all the events that need to
	 * be binded for private messaging to the passed in socket instance.
	 */
	privateMessage(user, message, ack) {
		/*
		 * Log the event in the server console.
		 */
		this.logger.info(['Received message from', this.socket.id, 'with content:',
			message, 'that will be transmitted to', user].join(' '));

		/*
		 * Transmit the received message payload to the specified socket ID.
		 */
		this.socket.to(user).emit('privateMessage', this.socket.id, message);

		/*
		 * This acknowledge function essentially sends a message back to the client
		 * acknowleding that the server received the send event. This particular
		 * ack sends the message body back to the client.
		 */
		ack(message);
	}
}