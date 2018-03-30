/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: March 4, 2018 by Grant Savage
 *
 * index.js
 * 
 * This file serves as the starting point of the socket server.
 * It pulls in the necessary modules, instantiates a new ServerManager
 * class, binds socket events and actions, and starts listening for
 * events on port 3000.
 */

/*
 * Pull in required modules and dependencies. We need a Server Manager for 
 * handling the core of our server and a SocketManager for handling our
 * web socket core. We also pull in a custom logger to make things easier
 * to debug. In addition we also pull in our modules that handle the event
 * received by the clients.
 */
const SocketManager = require('./SocketManager');
const ServerManager = require('./ServerManager');
const PrivateMessage = require('./EventHandlers/PrivateMessage');
const Room = require('./EventHandlers/Room');
const GroupMessage = require('./EventHandlers/GroupMessage');
const Log = require('./Helpers/Log');

module.exports = class Server {
  constructor(debug) {
    /*
     * Instantiate a new Log class instance
     */
    this.DEBUG = debug;
    this.logger = new Log(this.DEBUG);

    /*
     * Instantiate a new ServerManager class instance and 
     * SocketManager class instance while passing in the
     * Socket.io interface property of the ServerManager
     * to the SocketManager constructor
     */
    this.serverManager = new ServerManager();
    this.socketManager = new SocketManager(this.serverManager.io);

    this.bindEvents();
  }

  bindEvents() {
    /*
     * Bind our web socket events to a new socket connection.
     * This basically tells our SocketManager instance what to
     * do when it recieves a new connection and what to do when
     * it receives specific events on that connection.
     */
    this.socketManager.on('connection', (socket) => {
      /*
       * Log that a new user connected to our server and log
       * the UUID that the socketManager assigns that user.
       */
      this.logger.info('User Connected with ID of ' + socket.id);

      /*
       * Call the update users method to send out the updated list
       * of connected user socket IDs.
       */
      this.socketManager.updateUsers();

      /*
       * Call the update rooms method to send out the current
       * list of available rooms to all clients.
       */
      this.socketManager.updateRooms();

      /*
       * Bind the disconnect event to our SocketManager
       * instance and log that a user disconnected.
       */
      socket.on('disconnect', () => {
        /*
         * Log that a user disconnected from our server and log
         * the UUID of that user.
         */
        this.logger.error('User Disconnected with ID of ' + socket.id);

        /*
         * Call the update users method to send out the updated list
         * of connected user socket IDs.
         */
        this.socketManager.updateUsers();

        /*
         * Call the update rooms method to send out the current
         * list of available rooms to all clients.
         */
        this.socketManager.updateRooms();
      });

      /*
       * Create a dictionary of our event handler classes and 
       * instantiate those classes.
       */
      let eventHandlers = {
        privateMessage: new PrivateMessage(socket,this.logger),
        groupMessage: new GroupMessage(socket, this.logger),
        room: new Room(socket, this.logger, this.socketManager)
      };

      /*
       * Loop through the event handlers and for each event handler
       * register each method in an event handler to the socket 
       * instance.
       */
      for (let category in eventHandlers) {
        let handlers = eventHandlers[category].handlers;

        /*
         * Register methods in each event handler class to the
         * socket instance. 
         */
        for (let event in handlers) {
          socket.on(event, handlers[event]);
        }
      }
    });
  }

  start(port) {
    this.logger.info('Initializing Server...');

    /*
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

  stop() {
    this.serverManager.http.close();
  }
};
