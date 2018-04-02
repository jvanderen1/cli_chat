/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 1. 2018
 *
 * server/index.js
 *
 * This file serves as our server instantiation. When run,
 * this application creates a server-side application for use.
 */

/**
 * Pull in server module
 */
const Server = require('./Server');

/**
 * Instantiate new server and start the server on the specified port 
 */
if (require.main === module) {
  let server = new Server(true);
  server.start(3000);
}