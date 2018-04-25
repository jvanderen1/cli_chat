/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: April 1. 2018
 *
 * Server.js
 * 
 * This file serves as the starting point of the socket server.
 * It pulls in the necessary modules, instantiates a new ServerManager
 * class, binds socket events and actions, and starts listening for
 * events on port 3000.
 */

/**
 * Pull in required modules and dependencies. We need a Server Manager for 
 * handling the core of our server and a SocketManager for handling our
 * web socket core. We also pull in a custom logger to make things easier
 * to debug. In addition we also pull in our modules that handle the event
 * received by the clients.
 * 
 * The function require pulls in and reads the file specified just like
 * #include does.
 */
const SocketManager = require('./SocketManager');
const ServerManager = require('./ServerManager');
const PrivateMessage = require('./EventHandlers/PrivateMessage');
const Room = require('./EventHandlers/Room');
const GroupMessage = require('./EventHandlers/GroupMessage');
const Log = require('./Helpers/Log');

class Server {

  constructor(debug) {
    /**
     * Instantiate a new Log class instance
     */
    this.logger = new Log(debug);

    /**
     * Instantiate a new ServerManager class instance and 
     * SocketManager class instance while passing in the
     * Socket.io interface property of the ServerManager
     * to the SocketManager constructor
     */
    this.serverManager = new ServerManager();
    this.socketManager = new SocketManager(this.serverManager.io);

    /**
     * Bind the all events to server and new clients.
     */
    this.bindEvents();
  }

  bindEvents() {
    /**
     * Bind our web socket events to a new socket connection.
     * This basically tells our SocketManager instance what to
     * do when it recieves a new connection and what to do when
     * it receives specific events on that connection.
     */
    this.socketManager.on('connection', (socket) => {
      /**
       * Log that a new user connected to our server and log
       * the universally unique identifier (UUID) that the 
       * socketManager assigns that user.
       */
      this.logger.info('User Connected with ID of ' + socket.id);

      /**
       * Call the update rooms method to send out the current
       * list of available rooms to all clients.
       */
      this.socketManager.updateRooms();

      /**
       * Bind the disconnect event to our SocketManager
       * instance and log that a user disconnected.
       */
      socket.on('disconnect', () => {
        /**
         * Log that a user disconnected from our server and log
         * the UUID of that user.
         */
        this.logger.error('User Disconnected with ID of ' + socket.id);

        /**
         * Remove the user from the current users array.
         */
        this.socketManager.removeUser(socket.id);
        
        /**
         * Call the update rooms method to send out the current
         * list of available rooms to all clients.
         */
        this.socketManager.updateRooms();
      });

      /**
       * Create a dictionary of our event handler classes and 
       * instantiate those classes.
       */
      let eventHandlers = {
        privateMessage: new PrivateMessage(socket,this.logger),
        groupMessage: new GroupMessage(socket, this.logger),
        room: new Room(socket, this.logger, this.socketManager)
      };

      /**
       * Loop through the event handlers and for each event handler
       * register each method in an event handler to the socket 
       * instance.
       */
      for (let category in eventHandlers) {
        let handlers = eventHandlers[category].handlers;

        /**
         * Register methods in each event handler class to the
         * socket instance. 
         */
        for (let event in handlers) {
          socket.on(event, handlers[event]);
        }
      }
    });
  }

  /**
   * This method takes in the desired port to run the server on
   * and starts listening for http/websocket connections on that
   * port.
   */
  start(port) {
    this.logger.info('Initializing Server...');

    /**
     * Call the listen method on the http instance property of
     * our ServerManager instance. We pass in the port that we
     * want our server to listen on and log to the console that
     * our server is starting. This block essentially starts the
     * kernel of our server.
     */
    this.serverManager.http.listen(port, () => {
      this.logger.success('Server Started');
      this.logger.warn('Listening on port ' + port + ' for connections...');
    });
  }

  /**
   * This method stops the server.
   */
  stop() {
    this.serverManager.http.close();
  }
}

/**
 * Exports class for usage.
 */
module.exports = Server;