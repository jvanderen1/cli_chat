/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 19. 2018 by Grant Savage
 * 
 * Log.js
 *
 * This file contains the class definition for the
 * Log class. This file essentially pulls in a package
 * that changes the color of the console output so that
 * it looks a bit nicer and abstracts out the differnet
 * colors to methods. 
 */

/*
 * Pull in the colors package
 */
var colors = require('colors');

class Log {
	info(message) {
		console.log(message.cyan)
	}

	success(message) {
		console.log(message.green)
	}

	warn(message) {
		console.log(message.yellow)
	}

	error(message) {
		console.log(message.red)
	}
}

/*
 * Export the Log class
 */
module.exports = Log