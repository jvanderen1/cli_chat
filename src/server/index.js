/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 19. 2018 by Grant Savage
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
 * to debug.
 */
const SocketManager = require('./SocketManager');
const ServerManager = require('./ServerManager');
const Log = require('./Log');

/*
 * Instantiate a new Log class instance
 */
let logger = new Log();
logger.info('Initializing Server...');

/*
 * Instantiate a new ServerManager class instance and 
 * SocketManager class instance while passing in the
 * Socket.io interface property of the ServerManager
 * to the SocketManager constructor
 */
let serverManager = new ServerManager();
let socketManager = new SocketManager(serverManager.io);

/*
 * Bind our web socket events to a new socket connection.
 * This basically tells our SocketManager instance what to
 * do when it recieves a new connection and what to do when
 * it receives specific events on that connection.
 */
socketManager.on('connection', (socket) => {
	/*
	 * Log that a new user connected to our server and log
	 * the UUID that the socketManager assigns that user.
	 */
	logger.info('User Connected with ID of ' + socket.id);

	/*
	 * Bind the disconnect event to our SocketManager
	 * instance anc log that a user disconnected.
	 */
	socket.on('disconnect', () => {
		logger.error('User Disconnected with ID of ' + socket.id);
	});
});

/*
 * Call the listen method on the http instance property of
 * our ServerManager instance. We pass in the port that we
 * want our server to listen on and log to the console that
 * our server is starting. This block essentially starts the
 * kernel of our server.
 */
serverManager.http.listen(3000, () => {
	logger.success('Server Started');
	logger.warn('Listening on port 3000 for connections...')
});