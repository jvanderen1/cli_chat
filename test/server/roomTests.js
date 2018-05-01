/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 30. 2018
 *
 * roomTests.js
 * 
 * Module and I&T Tests
 *
 * This file contains the tests necessary for testing
 * our server CSUs for group messaging functionality.
 */

/**
 * Pull in the Server class and instantiate a new isntance.
 */
const Server = require('../../src/server/Server');
const httpServer = new Server(false);

/**
 * Pull in the assertion and expect interfaces
 * from the chai testing framework. Also pull in
 * the should interface for testing.
 */
const should = require('should');

/**
 * Pull in the socket.io client library for mocking
 * clients (create a fake client so that server can
 * perform as if there is a real client).
 */
const io = require('socket.io-client');

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
 * This block of tests test some aspects of the room logic
 * of the system such as receiving an updated list of rooms
 * when joining or leaving a room.
 */
describe('Server: Room', () => {
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
	 * This test asserts that the client receives an acknowledge message
	 * after attempting to join a room.
	 */
	it('should receive updated list of rooms when room is created', (done) => {
		// Create a test string to send
		const roomName = "abc123";
		let i = 0;
		// Create a new client
		const client1 = io.connect(socketURL, options);

		client1.on('rooms', (rooms) => {
			i++;
			if (i == 6) {
				rooms[0].should.containDeep(['abc123']);
				done()
			}
		});

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// When the first client connects, create another client
			const client2 = io.connect(socketURL, options);

			// Bind the connect event to the second client
			client2.on('connect', () => {

				// Send a private message to the second client
				client2.emit('joinRoom', roomName, (data) => {
				});
			});
		});
	}).timeout(30000);

	/**
	 * This tests that when a client leaves a room the server sends an 
	 * acknowledge message to the client.
	 */
	it('should receive acknowledge message when leaving room', (done) => {
		// Create a test string to send
		const roomName = "abc123"

		// Create a new client
		const client1 = io.connect(socketURL, options);

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// Send a private message to the second client
			client1.emit('joinRoom', roomName, (data) => {
				client1.emit('leaveRoom', roomName, (data) => {
					data.should.equal(roomName);

					// Disconnect the clients and end the test.
					client1.disconnect();
					done();
				});
			});
		});
	});
});