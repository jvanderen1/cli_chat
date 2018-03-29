/**
 * Pull in the Server and Client packages
 */
const Server = require('../../server/Server');
let httpServer = new Server(false);

const CLI_Client = require('../cli_client');
let client1 = CLI_Client;

/**
 * Pull in the socket.io client library
 * for mocking clients.
 */
let io = require('socket.io-client');

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
describe('Client Send Private Message Action', () => {

  ///////////
  // SETUP //
  ///////////

  before((done) => {

    if (!this.stdin) {
      this.stdin = require('mock-stdin').stdin();
    }

    /**
     * Start server on port 3000.
     */
    httpServer.start(3000);

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
   * This test asserts that when the mock clients attempts to message a user,
   * when there are none, the messaging will halt. The test fails if the test
   * fails to complete within 2 seconds.
   */
  it('should attempt to message user when none are present', (done) => {
    /**
     * 5:  Send Message to User/Room
     */
    this.stdin.send("5\r");

    done();
  });

  /**
   * @test
   *
   * This test asserts that the mock clients can message another client when
   * there is another present. The test fails if the test fails to complete
   * within 2 seconds.
   */
  it('should message user when 1 is present', (done) => {
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
     * Go here when client2 finishes connecting.
     */
    client2.on('connect', () => {

      /**
       * Go here when a new list of users is generated in client1
       */
      client1._socket.on('users', () => {
        if (!usersEventTriggered) {
          usersEventTriggered = true;

          /**
           * 5:  Send Message to User/Room
           */
          this.stdin.send("5\r");

          /**
           * Which user would you like to send a message to? (client2 -> 2)
           */
          this.stdin.send("2\r");

          /**
           * What is your message to 2?
           */
          this.stdin.send("test\r");

          done();
        }
      });
    });
  });

  /**
   * @test
   *
   * This test asserts that the message a mock client sends will be the same on
   * the receivers side. The test fails if the test fails to complete within
   * 2 seconds.
   */
  it('should send the correct message', (done) => {
    // TODO: Need way to intercept stdout
    done();
  });
});
