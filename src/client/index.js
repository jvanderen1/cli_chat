/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 1. 2018
 *
 * client/index.js
 *
 * This file serves as our client instantiation. When run,
 * this application creates a client-side application for use.
 */

const CLI_Client = require('./cli_client');

if (require.main === module) {
  let cli_client = new CLI_Client('http://localhost:3000');
}