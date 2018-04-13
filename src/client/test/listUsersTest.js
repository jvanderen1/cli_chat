/**
 * Pull in the Server and Client packages
 */
const Server = require('../../server/Server');
let httpServer = new Server(false);

const CLI_Client = require('../cli_client');
let client1;

/**
 * Pull in the socket.io client library
 * for mocking clients.
 */
let io = require('socket.io-client');

/**
 * Pull in the assertion and expect interfaces
 * from the chai testing framework. Also pull in
 * the should interface for testing.
 */
const should = require('should');

/**
 * Define out the URL the mock clients
 * should connect to and the options those
 * clients should use.
 */
let socketURL = 'http://localhost:3000';
let options = {
  transports: ['websocket'],
  'force new connection' : true
};

/**
 * @tests
 *
 * This block of tests test the private message functionality
 * of the clients and server.
 */
describe('Client List Users Action', () => {

  ///////////
  // SETUP //
  ///////////

  before((done) => {
    /**
     * Start server on port 3000.
     */
    httpServer.start(3000);

    /**
     * Pull in mock-stdin, to simulate standard input.
     * NOTE: Has to be here because there should not be multiple instantiations.
     */
    if (!this.stdin)
      this.stdin = require('mock-stdin').stdin();

    /**
     * Connect client to server.
     */
    client1 = new CLI_Client(socketURL);

    /**
     * Creating nickname of 'foo' for our client
     */
    client1._socket.on('connect', () => {
      /**
       * Creating nickname of 'foo' for our client
       */
      this.stdin.send("foo\r");

      done();
    });
  });

  after(() => {

    /**
     * Disconnect client from server.
     */
    client1._socket.disconnect();

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
   * This test asserts that when the mock clients attempts to list users that
   * are not present in the server, there will be a message displaying so. The
   * test fails if the test fails to complete within 2 seconds.
   */
  it('should attempt to list users connected to the room when none are present', (done) => {

    /**
     * 1:  List Current Online Users
     */
    this.stdin.send("1\r");

    done();
  });

  /**
   * @test
   *
   * This test asserts that the mock clients can list all the users present in
   * the server if there exists another client. The test fails if the test
   * fails to complete within 2 seconds.
   */
  it('should list users connected to the room when 1 is present', (done) => {
    /**
     * Creating 2nd mock client
     */
    let client2 = io.connect(socketURL, options);

    /**
     * Boolean variable to prevent multiple 'done()' calls.
     * @type {boolean}
     */
    let usersEventTriggered = false;

    /**
     * Go here when a new list of users is generated in client1
     */
    client1._socket.on('users', () => {

      if (!usersEventTriggered) {
        usersEventTriggered = true;

        /**
         * 1:  List Current Online Users
         */
        this.stdin.send("1\r");
        done();
      }
    });

    /**
     * Go here when client2 finishes connecting.
     */
    client2.on('connect', () => {
      /**
       * Create mock nickname for mock client.
       */
      client2.emit('nickname', 'foo', (nn) => {
        nn.should.equal('foo', 'nicknames should be retained');
      });
    });
  });

  /**
   * @test
   *
   * This test asserts that the list of users generated will be correct. The
   * test fails if the test fails to complete within 2 seconds.
   */
  it('should list the correct user', (done) => {
    // TODO: Need way to intercept stdout
    done();
  });
});
