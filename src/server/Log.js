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
	/*
	 * Get application debug state
	 */
	constructor(debugOn) {
		this.debugOn = debugOn;
	}

	/*
	 * Abstract log function that checks
	 * whether application debug is enabled
	 * and logging should be executed
	 */
	logMessage(message) {
		if (this.debugOn)
			console.log(message)
	}

	/*
	 * The four following functions provide wrappers
	 * for printing out output to the console in
	 * different colors.
	 */

	info(message) {
		this.logMessage(message.cyan)
	}

	success(message) {
		this.logMessage(message.green)
	}

	warn(message) {
		this.logMessage(message.yellow)
	}

	error(message) {
		this.logMessage(message.red)
	}
}

/*
 * Export the Log class
 */
module.exports = Log