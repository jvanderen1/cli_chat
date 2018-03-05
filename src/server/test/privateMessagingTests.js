/*
 * Pull in the assertion and expect interfaces
 * from the chai testing framework. Also pull in
 * the should interface for testing.
 */
let expect = require('chai').expect;
let assert = require('chai').assert;
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

/*
 * @tests
 *
 * This block of tests test the private message functionality
 * of the clients and server.
 */
describe('Client Private Message Passing', () => {
	/*
	 * @test
	 *
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

	/*
	 * @test
	 *
	 * This test asserts that when a client sends a private message to another
	 * user, the client receives an acknowledge message back indicating that
	 * the message was successfully sent.
	 */
	it('should receive acknowledge message when sending message to another user', (done) => {
		// Create a test string to send
		let testString = "Hello World!"

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

	/*
	 * @test
	 *
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