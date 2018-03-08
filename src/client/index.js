/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: March 4. 2018
 *
 * index.js
 *
 * This file serves as our client instantiation. When run,
 * this application creates a client-side application for use.
 */

const CLI_Client = require('./CLI_Client');

if (require.main === module) {
  new CLI_Client('http://localhost:3000');
}