/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 30. 2018
 *
 * webInterfaceTests.js
 * 
 * Module and I&T Tests
 *
 * This file contains the tests necessary for testing
 * our server CSUs for our web interface.
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
const expect = require('chai').expect;
const request = require('request');

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
const socketURL = 'http://localhost:' + port;
const options = {
	transports: ['websocket'],
	'force new connection' : true
};

/**
 * This block of tests test some aspects of the room logic
 * of the system such as receiving an updated list of rooms
 * when joining or leaving a room.
 */
describe('Server: Web Interface', () => {
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
	it('should receive 200 status code when requesting webpage', (done) => {
		request.get('http://localhost:3000', (err, res, body) => {
			res.statusCode.should.equal(200);
			done();
		});
	});

	/**
	 * This test asserts that the JS socket client on the webpageis able
	 * to connect to the server.
	 */
	it('should have the web socket connect', (done) => {
		request.get('http://localhost:3000', (err, res, body) => {
			expect(res.body).to.have.string('Connected');
			done();
		});
	})
})