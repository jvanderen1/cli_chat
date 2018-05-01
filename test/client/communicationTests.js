/**
 * Pull in the Server and Client packages
 */
const Server = require('../../src/server/Server');
let httpServer = new Server(false);

const CLI_Client = require('../../src/client/cli_client');
let client1 = CLI_Client;

/**
 * Define out the URL the mock clients
 * should connect to.
 */
const socketURL = 'http://localhost:3000';

/**
 * @tests
 *
 * This block of tests test the client's ability to connect and disconnect from the server.
 */
describe('Client: Connection and Disconnection', () => {

  ///////////
  // SETUP //
  ///////////

    /**
     * The before() function executes before the first it() function.
     */
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


    /**
     * The after() function executes after the last it() function.
     */
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
	
  /**
   * The it() function is from the Mocha framework. Each it() function is a test case. Mocha is a JavaScript 
   * test framework for Node.js programs, featuring browser support, asynchronous testing, test coverage reports, and 
   * use of any assertion library.
   */
	it('should connect to Server', (done) => {
    		client1 = new CLI_Client(socketURL, true);
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
