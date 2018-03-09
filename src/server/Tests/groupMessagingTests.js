const Server = require('../Server');
let httpServer = new Server(false);

/*
 * Pull in the assertion and expect interfaces
 * from the chai testing framework. Also pull in
 * the should interface for testing.
 */
let should = require('should');

/*
 * Pull in the socket.io client library
 * for mocking clients.
 */
let io = require('socket.io-client');

/*
 * Define out the URL the mock clients
 * should connect to and the options those
 * clients should use.
 */
let socketURL = 'http://localhost:3000';
let options = {
	transports: ['websocket'],
	'force new connection' : true
};

describe('Client Group Message Passing', () => {
	before(() => {
		httpServer.start();
	})

	after(() => {
		httpServer.stop();
		delete httpServer;
	});

	/*
	 * @test
	 *
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

	/*
	 * @test
	 *
	 * 
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