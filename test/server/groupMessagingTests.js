/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 30. 2018
 *
 * groupMessagingTests.js
 * 
 * Module and I&T Tests
 *
 * This file contains the tests necessary for testing
 * our server CSUs for group messaging functionality.
 */

const Server = require('../../src/server/Server');
let httpServer = new Server(false);

/**
 * Pull in the assertion and expect interfaces
 * from the chai testing framework. Also pull in
 * the should interface for testing.
 */
let should = require('should');

/**
 * Pull in the socket.io client library for mocking
 * clients (create a fake client so that server can
 * perform as if there is a real client).
 */
let io = require('socket.io-client');

/**
 * Define out the URL the mock clients
 * should connect to and the options those
 * clients should use.
 */
const port = 3000;
let socketURL = 'http://localhost:' + port;
let options = {
	transports: ['websocket'],
	'force new connection' : true
};

/**
 * This block includes tests for testing the functionality
 * of group messaging for our server.
 */
describe('Client: Client Group Message Passing', () => {
	/**
	 * The "before" block gets executed before the test for
	 * this test file get executed. The method below starts
	 * our the server on port 3000.
	 */
	before(() => {
		httpServer.start(port);
	});

	/**
	 * The "after" block gets executed after all tests for
	 * this test file get executed. The method below stops our
	 * server and deletes the instance from memory.
	 */
	after(() => {
		httpServer.stop();
		delete httpServer;
	});

	/**
	 * This block tests that a client in a room should be able to receive
	 * messages from other clients in the same room.
	 */
	it('should be able to receive messages from users in room', (done) => {
		// Create a test string to send
		const roomName = "abc123";
		const testMessage = "Hello World!";

		// Create a new client
		const client1 = io.connect(socketURL, options);

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// When the first client connects, create another client
			const client2 = io.connect(socketURL, options);

			// Bind the connect event to the second client
			client2.on('connect', () => {
				client1.emit('joinRoom', roomName, (data) => {
					// Check that thr acknowledged room name is the same
					data.should.equal(roomName);
					
					// Have client2 join the room
					client2.emit('joinRoom', roomName, (data) => {
						data.should.equal(roomName);

						// Send a private message to the second client
						client1.emit('groupMessage', roomName, testMessage, (message) => {});
					});
				});
			});

			/**
			 * Bind the callback for receiving a group message to client2.
			 */
			client2.on('groupMessage', (fromUser, room, message) => {
				message.should.equal(testMessage);
				room.should.equal(room)

				// Disconnect the clients and end the test.
				client1.disconnect();
				client2.disconnect();
				done();
			});
		});
	});

	/**
	 * This test asserts that the client receives an acknowledge message
	 * after attempting to join a room.
	 */
	it('should receive acknowledge message when joining room', (done) => {
		// Create a test string to send
		let roomName = "abc123"

		// Create a new client
		let client1 = io.connect(socketURL, options);

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// When the first client connects, create another client
			let client2 = io.connect(socketURL, options);

			// Bind the connect event to the second client
			client2.on('connect', () => {
				// Send a private message to the second client
				client1.emit('joinRoom', roomName, (data) => {
					// Assert that the acknowledge message is equal to the sent message
					data.should.equal(roomName);

					// Disconnect the clients and end the test.
					client1.disconnect();
					client2.disconnect();
					done();
				});
			});
		});
	});

	/**
	 * This block tests that a client receives an acknowledge message when sending
	 * a message to a room. 
	 */
	it('should receive acknowledge message sending message to room', (done) => {
		// Create a test string to send
		let roomName = "abc123";
		let testMessage = "Hellow World!";

		// Create a new client
		let client1 = io.connect(socketURL, options);

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// When the first client connects, create another client
			let client2 = io.connect(socketURL, options);

			// Bind the connect event to the second client
			client2.on('connect', () => {
				// Send a private message to the second client
				client1.emit('joinRoom', roomName, (data) => {});
				client1.emit('groupMessage', roomName, testMessage, (message) => {
					message.should.equal(testMessage);

					// Disconnect the clients and end the test.
					client1.disconnect();
					client2.disconnect();
					done();
				});
			});
		});
	});
})