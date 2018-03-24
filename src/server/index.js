/*
 * Pull in server module
 */
const Server = require('./Server');

/*
 * Instantiate new server and start the server
 */
if (require.main === module) {
  let server = new Server(true);
  server.start(3000);
}