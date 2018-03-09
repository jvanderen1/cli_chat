/*
 * Pull in server module
 */
const Server = require('./Server');

/*
 * Instantiate new server and start the server
 */
let server = new Server(true).start();