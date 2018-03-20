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
const expect = require('chai').expect;
const request = require('request');

/*
 * Pull in the socket.io client library
 * for mocking clients.
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
describe('Web Interface', () => {
	/*
	 * Before the test starts, start the server.
	 */
	before(() => {
		httpServer.start();
	})

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
	it('should receive 200 status code when requesting webpage', (done) => {
		request.get('http://localhost:3000', (err, res, body) => {
			res.statusCode.should.equal(200);
			done();
		});
	});

	it('should have the web socket connect', (done) => {
		request.get('http://localhost:3000', (err, res, body) => {
			expect(res.body).to.have.string('Connected');
			done();
		});
	})
})