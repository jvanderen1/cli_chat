/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 30. 2018
 *
 * privateMessagingTests.js
 * 
 * Module and I&T Tests
 *
 * This file contains the tests necessary for testing
 * our server CSUs for room logic.
 */

/**
 * Pull in the Server class and instantiate a new isntance.
 */
const Server = require('../../src/server/Server');
let httpServer = new Server(false);

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
 * This block of tests test the private message functionality
 * of the clients and server.
 */
describe('Server: Client Private Message Passing', () => {
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
	 * This test asserts that the mock clients can connect
	 * to our server. The test fails if the test fails to
	 * complete within 2 seconds.
	 */
	it('should connect to Server', (done) => {
		// Create a new client
		let client1 = io.connect(socketURL, options);

		// Bind the connection event to the client
		client1.on('connect', () => {
			// Once the first client is successfully created,
			// Create the second client.
			let client2 = io.connect(socketURL, options);

			// If the second client successfully connects,
			// disconnect the clients and end the test.
			client2.on('connect', () => {
				client1.disconnect();
				client2.disconnect();
				
				done();
			});
		});
	});

	/**
	 * This test asserts that when a client sends a private message to another
	 * user, the client receives an acknowledge message back indicating that
	 * the message was successfully sent.
	 */
	it('should receive acknowledge message when sending message to another user', (done) => {
		// Create a test string to send
		let testString = "Hello World!";

		// Create a new client
		let client1 = io.connect(socketURL, options);

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// When the first client connects, create another client
			let client2 = io.connect(socketURL, options);

			// Bind the connect event to the second client
			client2.on('connect', () => {
				// Send a private message to the second client
				client1.emit('privateMessage', client2.id, testString, (message) => {
					// Assert that the acknowledge message is equal to the sent message
					message.should.equal(testString);

					// Disconnect the clients and end the test.
					client1.disconnect();
					client2.disconnect();
					done();
				});
			});
		});
	});

	/**
	 * This test asserts that the client that receives a message from 
	 * another client is able to successfully receive the exact same
	 * message.
	 */
	it('should receive message from another user', (done) => {
		// Create a test string to send
		let testString = "Hello World!"

		// Create a client
		let client1 = io.connect(socketURL, options);

		// Bind the connect event to the client
		client1.on('connect', () => {
			// Create another client
			let client2 = io.connect(socketURL, options);

			// Bind the connect event to the second client
			client2.on('connect', () => {
				// Bind the privateMessage event to the client
				client2.on('privateMessage', (fromUser, message) => {
					// Assert that the received message is equal to the sent message.
					message.should.equal(testString);

					// Disconnect clients and end the test
					client1.disconnect();
					client2.disconnect();
					done();
				});

				// Send the test string to the second client
				client1.emit('privateMessage', client2.id, testString, (message) => {});
			});
		});
	});
});