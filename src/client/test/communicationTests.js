/**
 * Pull in the Server and Client packages
 */
const Server = require('../../server/Server');
let httpServer = new Server(false);

const CLI_Client = require('../cli_client');
let client1 = CLI_Client;

/**
 * Define out the URL the mock clients
 * should connect to.
 */
const socketURL = 'http://localhost:3000';

/**
 * @tests
 *
 * This block of tests test the private message functionality
 * of the clients and server.
 */
describe('Client Connection and Disconnection', () => {

  ///////////
  // SETUP //
  ///////////

	before(() => {

    /**
     * Pull in mock-stdin, to simulate standard input.
     * NOTE: Has to be here because there should not be multiple instantiations.
     */
	  if (!this.stdin)
	    this.stdin = require('mock-stdin').stdin();

    /**
		 * Start server on port 3000.
     */
		httpServer.start(3000);
	});

	after(() => {
		/**
		 * Close server connection.
		 */
		httpServer.stop();
	});

  /////////////
  // TESTING //
  /////////////

  /**
   * @test
   *
   * This test asserts that the mock clients can connect to our server. The
   * test fails if the test fails to complete within 2 seconds.
   */
	it('should connect to Server', (done) => {

    client1 = new CLI_Client(socketURL);
    client1._socket.on('connect', () => {
      /**
			 * Creating nickname of 'foo' for our client
       */
			this.stdin.send("foo\r");
			done();
		});
	});

	/**
	 * @test
	 *
	 * This test asserts that the mock clients can disconnect to our server. The
   * test fails if the test fails to complete within 2 seconds.
	 */
	it('should disconnect from Server', (done) => {
    client1._socket.disconnect();
    done();
	});
});
