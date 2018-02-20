/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 19. 2018 by Grant Savage
 *
 * PrivateMessageManager.js
 * 
 * This file contains the class definition for our
 * PrivateMessageManager. The PrivateMessageManager
 * class contains the methods that handle the logic
 * for sending peer to peer messages between clients.
 */

class PrivateMessageManager {
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
	 * be binded for private messaging to the passed in socket instance.
	 */
	handleEvent() {
		/*
		 * This event handler will then send the message
		 * to the appropriate message to the specified socket ID.
		 */
		this.socket.on('private message', (toUser, message, ack) => {
			/*
			 * Log the event in the server console.
			 */
			this.logger.info('Received message from ' + this.socket.id + ' with content: ' + message);
			this.logger.info('that will be transmitted to ' + toUser);

			/*
			 * Transmit the received message payload to the specified socket ID.
			 */
			this.socket.to(toUser).emit('private message', this.socket.id, message);

			/*
			 * This acknowledge function essentially sends a message back to the client
			 * acknowleding that the server received the send event. This particular
			 * ack sends the message body back to the client.
			 */
			ack(message);
		});
	}
}

/*
 * Export the class
 */
module.exports = PrivateMessageManager;