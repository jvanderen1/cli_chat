/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: March 4. 2018
 *
 * CLI_Client.js
 * 
 * This file serves as our client application. When run,
 * this application connects to our backend server and allows
 * the relaying of messages to other clients connected.
 */

module.exports = class CLI_Client {

  constructor(IPAddress) {
    /*
    * Pull in the socket.io client package and instantiate a new
    * instance of it passing in the address of our socket server.
    * We also pull in the readline package that allows our app
    * to read input from standard in and interact with the command
    * line.
    */
    this._socket = require('socket.io-client')(IPAddress);
    let readline = require('readline');

    /*
    * Create the line reader interface and pass in standard input
    * and output as parameters.
    */
    this._rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    /*
    * Array to keep track of the current online users.
    */
    this._users_g = [];

    /*
     * Set options available inside of Map object, where Map item = ( key, [title, function] ).
     */
    this._options_map = new Map();
    this._options_map.set(1, ['List Current Online Users', () => { this.listUsers(); }]);
    this._options_map.set(2, ['Send Message to User', () => { this.sendMessage(); }]);
    this._options_map.set(3, ['Exit App', () => { this.exitApp(); }]);

    /*
     * Used to bind all socket events to specific functions within the client.
     */
    this._bind_events();
  }

  _bind_events() {
    /*
     * When our client receives a users event, set the users_g variable equal
     * to the new array of online users.
     */
    this._socket.on('users', (users) => {
      this._users_g = users[0];
    });

    /*
     * When our client connects log it and display the menu options.
     */
    this._socket.on('connect', () => {
      console.log('App Connected!\n');
      for (const [key, value] of this._options_map) {
        console.log([key, value[0]].join(': '));
      }
      console.log();
      this.getInput();
    });

    /*
     * When our client receives a new private message, display who it is from and the mssage body.
     */
    this._socket.on('privateMessage', (fromUser, message) => {
      console.log('\n\n\tNew Message from ' + fromUser + '\n\tContent: ' +
          message + '\n');

      /*
       * Get user menu option choice.
       */
      this.getInput();
    });

  }

  /*
   * Define out a function that asks the user what menu option they would like to choose.
   * Once the user has entered their desired option, determine which operation to perform
   * and perform the operation. The three main operations are: list current online users,
   * send a message to a online user, and quit the application.
   */
  getInput() {
    /*
     * Get the user's menu option.
     */

    this._rl.question('What would you like to do? ', (choice) => {
      /*
       * If the user selected to display the list of online users,
       * iterate over the array of users and display them to the console.
       */

      if (this._options_map.has(+choice)) {
        /*
         * Select correct function from the options available.
         */
        this._options_map.get(+choice)[1]();
      }

      else {
        /*
         * Go here if item was not found in map.
         */

        console.log('\nPlease choose a valid menu option.\n');
        for (const [key, value] of this._options_map) {
          console.log([key, value[0]].join(': '));
        }
        console.log();

        /*
         * Get desired menu option again.
         */
        this.getInput();
      }
    });
  }

  /*
   * Method used to gather a list of all connected users and print them to the
   * console.
   */
  listUsers() {
    console.log('\nList of online users:\n');

    for (let i = 0; i < this._users_g.length; i++) {
      if (this._users_g[i] !== this._socket.id)
        console.log(i + 1 + '. ' + this._users_g[i]);
    }

    console.log('\n');

    /*
     * Ask for user input again.
     */
    this.getInput();
  }

  /*
   * Method used to send a message to another specified user.
   */
  sendMessage() {

    if (this._users_g.length === 1) {
      console.log('\nThere are no other users to message.\n');
      return;
    }

    this._rl.question('\nWhich user would you like to send a message to? ',
        (user) => {

          /*
           * Check that the user's choice of user is in the range of the user
           * array.
           */

          if (user < 1 || user > this._users_g.length) {
            console.log('\nInvalid user selection.\n');
            this.getInput();
            return;
          }

          /*
           * Get the content of the message to send.
           */
          this._rl.question('\nWhat is your message to ' + user + '? ',
              (message) => {
                /*
                 * Send the id of the desired user and message body to the
                 * server for relaying to the desired user.
                 */

                this._socket.emit('privateMessage', this._users_g[user - 1],
                    message, (ack) => {
                      console.log('\nMessage \"' + ack + '\" sent.\n');

                      /*
                       * Display option prompt again.
                       */
                      this.getInput();
                    });
              });
        });
  }

  /*
   * Method used to exit application and end process.
   */
  exitApp() {
    console.log('\nQuitting App...\n');
    process.exit(1);
  }
};
