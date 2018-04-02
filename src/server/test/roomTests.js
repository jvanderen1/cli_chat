/*
 * Pull in the Server class and instantiate a new isntance.
 */
const Server = require('../Server');
const httpServer = new Server(false);

/*
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

/*
 * Define out the URL the mock clients
 * should connect to and the options those
 * clients should use.
 */
const socketURL = 'http://localhost:3000';
const options = {
	transports: ['websocket'],
	'force new connection' : true
};

/*
 * This block of tests test some aspects of the room logic
 * of the system such as receiving an updated list of rooms
 * when joining or leaving a room.
 */
describe('Room', () => {
	/*
	 * Before the test starts, start the server.
	 */
	before(() => {
		httpServer.start(3000);
	});

	/*
	 * After the test is finished, stop the server
	 * and delete its instance.
	 */
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
	it('should receive updated list of rooms when room is created', (done) => {
		// Create a test string to send
		const roomName = "abc123"

		// Create a new client
		const client1 = io.connect(socketURL, options);

		// Bind the connect event to the client.
		client1.on('connect', () => {
			// When the first client connects, create another client
			const client2 = io.connect(socketURL, options);

			// Bind the connect event to the second client
			client2.on('connect', () => {
				client2.on('rooms', (rooms) => {
					rooms.should.containDeep(rooms);

					// Disconnect the clients and end the test.
					client1.disconnect();
					client2.disconnect();
					done();
				});

				// Send a private message to the second client
				client1.emit('joinRoom', roomName, (data) => {});
			});
		});
	});

	/*
	 * @test
	 *
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
})