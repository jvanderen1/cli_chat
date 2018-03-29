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
let socketURL = 'http://localhost:3000';

/**
 * @tests
 *
 * This block of tests test the room functionality
 * of the clients.
 */
describe('Client Room Action', () => {

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
   * This test asserts that the mock clients can create and join a room.
   * The test fails if the test fails to complete within 2 seconds.
   */
  it('should create and join a room', (done) => {

    /**
     * 3:  Join Room
     */
    this.stdin.send("3\r");

    /**
     * Create room (Y/N)?
     */
    this.stdin.send("Y\r");

    /**
     * Name of room:
     */
    this.stdin.send("testRoom\r");

    done();
});

  /**
   * @test
   *
   * This test asserts that the mock clients can leave a room.
   * The test fails if the test fails to complete within 2 seconds.
   */
  it('should leave a room while in a room', (done) => {

    /**
     * 4:  Leave Room
     */
    this.stdin.send("4\r");

    done();
  });

  /**
   * @test
   *
   * This test asserts that when the mock clients attempts to leave a room
   * they are not in, they will not move anywhere. The test fails if the
   * test fails to complete within 2 seconds.
   */
  it('should try to leave a room while not in a room', (done) => {

    /**
     * 4:  Leave Room
     */
    this.stdin.send("4\r");

    done();
  });
});
