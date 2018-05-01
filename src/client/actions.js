/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: April 1. 2018
 *
 * actions.js
 *
 * This file serves as our user actions. Here, a list of every command
 * user can make is made available.
 * MUST be used as a mixin with 'cli_client.js'
 */

/**
 * `this._in_question` is used to prevent confusing printouts, while the client is in a question.
 * During all questions, `this._in_question` is always set to True.
 * When the question is complete, `this._in_question` is always set to False.
 */

let Actions = {

  /**
   * Method used to gather a list of all connected users and print them to the
   * console.
   */
  listUsers() {
    /** List Current Online Users */

    /**
     * The function console.log prints the given string to the console.
     */
    console.log('\nList of online users:\n');

    /**
     * If the length of the array users_g is 1 then there is only one user
     * connected.
     * If there is more than one user connected, print every element of the
     * array, displaying all the users.
     */
    if (this._users.length === 1) {
      console.log('No other users online.');
    }
    else {
      for (let i = 0; i < this._users.length; i++) {
        if (this._users[i].id !== this._socket.id) {
          console.log(i + 1 + '. ' + this._users[i].nickname);
        }
      }
    }

    /**
     * Ask for user input again.
     */
    this.printPrompt();
  },

  /**
   * Method used to gather a list of all existing rooms and print them to the
   * console.
   */
  listRooms() {
    /** List Current Existing Rooms */
    
    /**
     * Notify user that there are no existing rooms.
     */
    if (this._rooms.length === 0) {
      console.warn('\nNo existing rooms.');
    }
    
    /**
     * Print every element of the this._rooms array to list the
     * existing rooms.
     */
    else {
      console.log('\nExisting rooms: ');
      for (let i = 0; i < this._rooms.length; i++) {
        console.log(this._rooms[i]);
      }
    }
    
    /**
     * Ask for user input again.
     */
    this.printPrompt();
  },


  /**
   * Ask the user if they want to create a room, name it, and automatically
   * put the user in the room.
   */
  createRoom() {
    /** Create Room */

    /**
     * User cannot join a room if already in a room.
     */
    if (this._currentRoom !== null) {
      console.warn('\nYou are already in room ' + this._currentRoom + '.');
      console.warn('Leave your current room in order to create another.');
      this.printPrompt();
    }

    else {    
      /**
       * The variable in_question prevents the program from printing the prompt
       * when the user is in the middle of a question.
       */
      this._in_question = true;

      this._rl.question('\nCreate room (Y/N)? ',
          (answer) => {
            if (answer === 'Y') {
              this._rl.question('\nName of room: ',
                  (room) => {
                    /**
                     * NONE is the keyword for the user to create a room after
                     * choosing the 'Join Room' option (refer to line 155) and
                     * therefore cannot be a name for a room.
                     */
                    if (room === 'NONE') {
                      console.error('\'' + room + '\' is an invalid room name.');
                      this.printPrompt();
                    }
                    /**
                     * Emit the event and display the success message.
                     */
                    else {
                      this._socket.emit('joinRoom', room, (roomName) => {
                        console.log("\nJoined room " + roomName);
                        this.printPrompt();
                      });
                      this._currentRoom = room;
                    }
                  });
            }
            else {
              this.printPrompt();
            }

            this._in_question = false;
          });
    }
  },

  /**
   * Let user choose a room to join and put them in that room.
   */
  joinRoom() {
    /** Join Room */

    /**
     * Prompt user to create room if there aren't any existing rooms.
     */
    if (this._rooms.length === 0) {
      console.warn('\nNo existing rooms.');
      this.createRoom();
    }

    /**
     * User cannot join a room if already in a room.
     */
    else if (this._currentRoom !== null) {
      console.error('\nYou are already in room ' + this._currentRoom + '.');
      console.error('Leave your current room in order to join another.');
      this.printPrompt();
    }

    else {
      /**
       * User will enter the name of any existing room to join it or
       * enter 'NONE' to create a new room.
       */

      this._in_question = true;

      this._rl.question('\nWhich room would you like to join? (NONE to create room) ',
          (room) => {
            if (this._rooms.indexOf(room) >= 0) {
              this._socket.emit('joinRoom', room, (roomName) => {
                console.log("Joined room " + roomName);
                 this.printPrompt();
              });
              this._currentRoom = room; 
            }
            else if (room === 'NONE') {
              this.createRoom();
            }
            else {
              console.error('\nInvalid room selection: \'' + room + '\' is not a currently existing room.');
              console.error('Please try again.');
              this.joinRoom();
            }

            this._in_question = false;
          });
    }
  },


  /**
   * Pull the user out of a room if they are in one.
   */
  leaveRoom() {
    /** Leave Room */

    if (this._currentRoom !== null) {
      this._socket.emit('leaveRoom', this._currentRoom, (roomName) => {
        console.log("Left room.");
        this._currentRoom = null;
        this.printPrompt();
      });
    }
    else
    {
      console.error('\nYou are not currently in any rooms.');
      this.printPrompt();
    }
  },


  /**
   * Method used to send a message to another specified user or to everyone in the same room.
   */
  sendMessage() {
    /** Send Message to User/Room */

    if (this._users.length === 1) {
      console.error('\nThere are no other users to message.');
      this.printPrompt();
    }

    /**
     * Send private message if user is not currently in a room.
     */
    else if (this._currentRoom === null) {

      this._in_question = true;

      this._rl.question('\nWhich user would you like to send a message to? ',
          (user) => {
            /**
             * Check that the user's choice of user is in the range of the user
             * array.
             */
            if (user < 1 || user > this._users.length) {
              console.error('\nInvalid user selection.\n');
              this.printPrompt();
              this._in_question = false;
              return;
            }

            /**
             * Get the content of the message to send.
             */
            this._rl.question('\nWhat is your message to ' + this._users[user - 1].nickname + '? ',
                (message) => {
                  /**
                   * Send the id of the desired user and message body to the
                   * server for relaying to the desired user.
                   */

                  this._socket.emit('privateMessage', this._users[user - 1].id,
                      message, (ack) => {
                        console.log('\nMessage \"' + ack + '\" sent.\n');

                        /**
                         * Display option prompt again.
                         */
                        this.printPrompt();
                        this._in_question = false;
                      });
                });
          });
    }

    /**
     * Send group message to everyone in the room that the user is currently in
     */
    else {
      /**
       * Get the content of the message to send.
       */

      this._in_question = true;

      this._rl.question('\nWhat is your message to ' + this._currentRoom + '? ',
          (message) => {

          /**
           * Send the room name of the user's current room and message body to the
           * server for relaying to the desired room.
           */

          this._socket.emit('groupMessage', this._currentRoom,
              message, (ack) => {
            console.log('\nMessage \"' + ack + '\" sent.\n');

            /**
             * Display option prompt again.
             */
            this.printPrompt();
          });

          this._in_question = false;
      });
    }
  },

  /**
   * Method used to exit application and end process.
   */
  exitApp() {
    /** Exit App */

    console.log('\nQuitting App...\n');
    process.exit(0);
  }
};

/**
 * Exports variable for usage.
 */
exports.Actions = Actions;
