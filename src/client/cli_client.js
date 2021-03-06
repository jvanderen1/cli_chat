/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 30. 2018
 *
 * cli_client.js
 *
 * This file serves as our client application. When run,
 * this application connects to our backend server and allows
 * the relaying of messages to other clients connected.
 */

class CLI_Client {

  constructor(IPAddress, debug) {
    /**
     * Pull in the socket.io client package and instantiate a new
     * instance of it passing in the address of our socket server.
     * We also pull in the readline package that allows our app
     * to read input from standard in and interact with the command
     * line.
     */
    this._socket = require('socket.io-client')(IPAddress);

    /**
     * DEBUG variable is used to determine whether or not to turn console log
     * off or not. (i.e. Make it an empty function)
     */
    this.DEBUG = debug;

    /**
     * Array to keep track of the current online users, the existing rooms,
     * and the current room the user is in.
     */
    this._users = [];
    this._rooms = [];
    this._currentRoom = null;

    /**
     * Create the line reader interface and pass in standard input
     * and output as parameters (if DEBUG is off).
     */
    this._rl = this.createReadline();

    /**
     * Calls in the actions.js file to be used in this class to
     * provide different options for the user to choose to do.
     */
    const Actions = require('./actions').Actions;

    /**
     * Utilize mixins to merge actions to client.
     */
    this.createActions(Actions);

    /**
     * Set options available inside of Map object, where Map item = ( int, [string, function()] ).
     */
    this._options_map = this.createOptionsMap(Actions);

    /**
     * Control variable for printing out prompt while client has selected option.
     */
    this._in_question = false;

    /**
     * Used to bind all socket events to specific functions within the client.
     */
    this._bind_events();
  }

  ////////////////////////////////////////
  // Used during construction of class. //
  ////////////////////////////////////////

  /**
   * Binds all events to this class (both socket events and readline events).
   * @private
   */
  _bind_events() {
    /**
     * When our client receives a users event, set the users variable equal
     * to the new array of online users.
     */
    this._socket.on('users', (users) => {
      this._users = users[0];
    });

    /**
     * When our client receives a rooms event, set the rooms variable equal
     * to the new array of existing rooms.
     */
    this._socket.on('rooms', (rooms) => {
      this._rooms = rooms[0];
    });

    /**
     * When our client connects, log it, display their UUID, and prompt for a nickname.
     */
    this._socket.on('connect', () => {
      console.log('App Connected!\n');
      console.log(
          'Disclaimer: This application is not fully secured and messages sent may be seen by other parties.\n');
      console.log('Current user ID: ' + this._socket.id);
      this.createNickname();
    });

    /**
     * When our client receives a new private message, display who it is from and the message body.
     */
    this._socket.on('privateMessage', (fromUser, message) => {
      console.log('\n\n\tNew Message from ' +
          this._users.find(u => u.id === fromUser).nickname);
      console.log('\n\tContent: ' + message);

      /**
       * Get user menu option choice.
       * Only print the prompt if user is not currently in a question.
       */
      if (!this._in_question)
        this.printPrompt();
      else
        this._rl.prompt();
    });

    /**
     * When our client receives a new group message, display who it is from, what room it is to,
     * and the message body.
     */
    this._socket.on('groupMessage', (fromUser, roomName, message) => {
      console.log('\n\n\tNew Message from ' +
          this._users.find(u => u.id === fromUser).nickname);
      console.log('\n\tTo room: ' + roomName);
      console.log('\n\tContent: ' + message);
      console.log();

      if (!this._in_question)
        this.printPrompt();
      else
        this._rl.prompt();
    });

    /**
     * Get user input when they hit Enter ('\n' or '\r').
     */
    this._rl.on('line', (input) => {
      this.selectChoice(input);
    });
  }

  /**
   * Associates a variable full of methods with this object.
   */
  createActions(action) {
    Object.assign(this, action);
  }

  /**
   * Process user input for unique nicknames to replace this._socket.id (random array of
   * characters).
   */
  createNickname() {

    this._in_question = true;

    this._rl.question('Nickname: ', (nickname) => {
      this._socket.emit('nickname', nickname, (nn) => {
        this._rl.setPrompt(`${nn} > `);
        this.printPrompt();
        this._in_question = false;
      });
    });
  }

  /**
   * Creates a map of options for the user to select from.
   * @param options_set: list of mixin functions
   * @returns {Map<int, [string, function()]>}
   */
  createOptionsMap(options_set) {
    /**
     * Package used to gather the docstrings of functions made.
     */
    const docstrings = require('docstring');

    let options_map = new Map();
    let i = 1;

    /**
     * Build option map with an ascending integer, a description, and the
     * function referenced.
     */
    for (let option in options_set) {
      options_map.set(i,
          [options_set[option].__doc__, () => { this[option](); }]);
      i++;
    }

    return options_map;
  }

  /**
   * Creates a readline object for gathering input.
   * @returns {readline object}
   */
  createReadline() {
    const readline = require('readline');

    /**
     * Create the line reader interface and pass in standard input
     * as a parameter when DEBUG is true.
     */
    if (this.DEBUG)
      return readline.createInterface({
        input: process.stdin,
      });

    /**
     * Create the line reader interface and pass in standard input
     * and output as parameters when DEBUG is false.
     */
    else
      return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
  }

  /////////////////////////////////////
  // Used during execution of class. //
  /////////////////////////////////////

  /**
   * Every time the user completes choosing an option, a list of new options
   * will appear.
   */
  printPrompt() {
    /**
     * Get the user's menu option.
     */
    if (!this.DEBUG) {
      console.log('\nOptions:\n');
      for (const [key, value] of this._options_map) {
        console.log([key, value[0]].join(': '));
      }

      console.log();
      console.log('What would you like to do? ');
    }
    this._rl.prompt();
  }

  /**
   * Define out a function that asks the user what menu option they would like to choose.
   * Once the user has entered their desired option, determine which operation to perform
   * and perform the operation. The three main operations are: list current online users,
   * send a message to a online user, and quit the application.
   *
   * @param choice: option user selects
   */
  selectChoice(choice) {
    /**
     * If the user selected to display the list of online users,
     * iterate over the array of users and display them to the console.
     */
    if (this._options_map.has(+choice)) {
      /**
       * Select correct function from the options available.
       */
      this._options_map.get(+choice)[1]();
    }

    else {
      /**
       * Go here if item was not found in map.
       */
      console.log('\nPlease choose a valid menu option.\n');
      console.log();

      /**
       * Get desired menu option again.
       */
      this.printPrompt();
    }
  }
}

/**
 * Exports class for usage.
 */
module.exports = CLI_Client;
