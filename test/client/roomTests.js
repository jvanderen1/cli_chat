/**
 * Pull in the Server and Client packages
 */
const Server = require('../../src/server/Server');
let httpServer = new Server(false);

const CLI_Client = require('../../src/client/cli_client');
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
 * Name of room used during these tests
 */
let testRoom = 'abc123';

/**
 * @tests
 *
 * This block of tests test the room functionality
 * of the clients.
 */
describe('Client: Room Action', () => {

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
    client1 = new CLI_Client(socketURL, true);

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
    this.stdin.send(testRoom + "\r");

    done();
  });

  /**
   * @test
   *
   * This test asserts that the mock client can receive a group message from
   * the room they reside in from other room members. The test fails if the
   * test fails to complete within 2 seconds.
   */
  it('should receive group message from a room', (done) => {

    /**
     * Creating 2nd mock client
     */
    let client2 = io.connect(socketURL, options);

    /**
     * String variable to check correct message
     * @type {string}
     */
    let testMessage = 'bar';

    client1._socket.on('groupMessage', (fromUser, room, message) => {
      fromUser.should.equal(client2.id);
      room.should.equal(testRoom);
      message.should.equal(testMessage);
      done();
    });

    /**
     * Allows client2 to connect to the server with a nickname
     */
    client2.on('connect', () => {
      client2.emit('nickname', 'foo', (nn) => {
        client2.emit('joinRoom', testRoom, (room) => {
          room.should.equal(testRoom);

          client2.emit('groupMessage', room, testMessage, (message) => {
            message.should.equal(testMessage);
          });
        });
      });
    });
  });

  /**
   * @test
   *
   * This test asserts that the mock client can send a group message to the
   * the room they reside in to other room members. The test fails if the test
   * fails to complete within 2 seconds.
   */
  it('should send group message to room from client', (done) => {

    /**
     * Prepares message sending to the room.
     */
    this.stdin.send('5\r');

    /**
     * Sends a test message to the room.
     */
    this.stdin.send('Hello\r');

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
