/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 30. 2018
 *
 * nicknameTests.js
 * 
 * Module and I&T Tests
 *
 * This file contains the tests necessary for testing
 * our server CSUs for nickname functionality.
 */

/**
 * Pull in the Server class and instantiate a new isntance.
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
 * This block of tests test the private message functionality
 * of the clients and server.
 */
describe('Server: User and Nickname Tests', () => {
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
	 * This test asserts that when a client connects and enters their username
	 * a updated list of users is sent out to other clients containing the 
	 * correct data.
	 */
	it('should receive updated list of users when a user connects', (done) => {
		// Create a new client
		let client1 = io.connect(socketURL, options);

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// When the first client connects, create another client
			let client2 = io.connect(socketURL, options);
			
			client1.emit('nickname', "Jacob", (nickname) => {
				nickname.should.equal("Jacob");
			});

			// Bind the connect event to the second client
			client2.on('connect', () => {
				client2.on('users', (users) => {
					users[0].should.containEql({
						id: client1.id,
						nickname: "Jacob"
					});

					users[0].should.containEql({
						id: client2.id,
						nickname: "Grant"
					});

					// Disconnect the clients and end the test.
					client1.disconnect();
					client2.disconnect();
					done();
				});

				client2.emit('nickname', "Grant", (nickname) => {
					nickname.should.equal("Grant");
				});
			});
		});
	});

	/**
	 * This test asserts that when a client disconnects or exits the application
	 * the client is removed from the global list of connected users and the new
	 * list of users is sent out.
	 */
	it('should receive updated list of users when a user disconnects', (done) => {
		// Create a new client
		let client1 = io.connect(socketURL, options);

		let i = 0;

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// When the first client connects, create another client
			let client2 = io.connect(socketURL, options);

			let id = client1.id;
			
			client1.emit('nickname', "Jacob", (nickname) => {
				nickname.should.equal("Jacob");
			});

			client2.on('users', (users) => {
				i++;
				
				// A hack
				if (i === 2) {
					users[0].should.not.containEql({
						id: client1.id,
						nickname: "Jacob"
					});

					users[0].should.containEql({
						id: client2.id,
						nickname: "Grant"
					});

					client2.disconnect();
					done();
				}
			});

			// Bind the connect event to the second client
			client2.on('connect', () => {
				client2.emit('nickname', "Grant", (nickname) => {
					nickname.should.equal("Grant");

					client1.disconnect();
				});
			});
		});
	});
});