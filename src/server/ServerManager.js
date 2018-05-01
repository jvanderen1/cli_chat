/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: April 30. 2018
 *
 * ServerManager.js
 * 
 * This file contains the class definition for the 
 * ServerManager class. The ServerManager class pulls
 * in and assigns some core packages that our server
 * needs to work. It pulls in the express web framework
 * and http server module to enable serving requests
 * over http and other protocols. This file also 
 * (for now) sends a HTML file to the root URL of 
 * the application for testing. The HTML file contains
 * some basic socket.io client JS for testing.
 */

class ServerManager {

	/**
	 * Default constructor with no arguments
	 */
	constructor() {
		/**
		 * Pull in and attach required modules to the
		 * ServerManager class instance. 
		 */
		this.app = require('express')();
		this.http = require('http').Server(this.app);
		this.io = require('socket.io')(this.http);

		/**
		 * Send index.html when a request is made at
		 * the root of the URL schema.
		 */
		this.app.get('/', (req, res) => {
			res.sendFile(__dirname + '/Views/index.html');
		});
	}
}

/**
 * Exports class for usage.
 */
module.exports = ServerManager;