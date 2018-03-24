/**
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 *
 * Updated: March 23. 2018
 *
 * actions.js
 *
 * This file serves as our user actions. Here, a list of every command
 * user can make is made available.
 * MUST be used as a mixin with 'cli_client.js'
 */

let Actions = {

  /**
   * Method used to gather a list of all connected users and print them to the
   * console.
   */
  listUsers() {
    /** List Current Online Users */

    console.log('\nList of online users:\n');

    if (this._users_g.length === 1) {
      console.log('No other users online.');
    }
    else {
      for (let i = 0; i < this._users_g.length; i++) {
        if (this._users_g[i] !== this._socket.id) {
          console.log(i + 1 + '. ' + this._users_g[i]);
        }
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

    this._rl.question('\nCreate room (Y/N)? ',
        (answer) => {
          if (answer === 'Y') {
            this._rl.question('\nName of room: ',
                (room) => {
                  if (room === 'NONE') {
                    console.log('Invalid room name.');
                  }
                  else {
                    this._socket.emit('joinRoom', room, (roomName) => {
                      console.log("Joined room " + roomName);
                    });
                    this._currentRoom = room;
                  }
                  this.printPrompt();
                });
          }
          else {
            this.printPrompt();
          }
        });
  },

  /**
   * Let user choose a room to join and put them in that room
   */
  joinRoom() {
    /** Join Room */

    /**
     * Prompt user to create room if there aren't any existing rooms.
     */
    if (this._rooms_g.length === 0) {
      console.log('\nNo existing rooms.');
      this.createRoom();
    }

    /**
     * User cannot join a room if already in a room.
     */
    else if (this._currentRoom !== null) {
      console.log('\nYou are already in room ' + this._currentRoom + '.');
      console.log('Leave your current room in order to join another.');
      this.printPrompt();
    }

    else {
      /**
       * Print every element of the this._rooms_g array to list the
       * existing rooms.
       */
      console.log('\nExisting rooms: ');
      for (let i = 0; i < this._rooms_g.length; i++) {
        console.log(this._rooms_g[i]);
      }

      /**
       * User will enter the name of any existing room to join it or
       * enter 'NONE' to create a new room.
       */
      this._rl.question('\nWhich room would you like to join? (NONE to create room) ',
          (room) => {
            if (this._rooms_g.indexOf(room) >= 0) {
              this._socket.emit('joinRoom', room, (roomName) => {
                console.log("Joined room " + roomName);
              });
              this._currentRoom = room;
              this.printPrompt();
            }
            else if (room === 'NONE') {
              this.createRoom();
            }
            else {
              console.log('\nInvalid room selection.');
              this.printPrompt();
            }
          });
    }
  },


  /**
   * Pull the user out of a room if they are in one.
   */
  leaveRoom() {
    /** Leave Room */

    if (this._currentRoom !== null) {
      this._socket.emit('leaveRoom', this.room, (roomName) => {
        console.log("Left room.");
        this._currentRoom = null;
      });
    }
    else
      console.log('\nYou are not currently in any rooms.');

    this.printPrompt();
  },


  /**
   * Method used to send a message to another specified user or to everyone in the same room.
   */
  sendMessage() {
    /** Send Message to User/Room */

    if (this._users_g.length === 1) {
      console.log('\nThere are no other users to message.');
      this.printPrompt();
      return;
    }

    /**
     * Send private message if user is not currently in a room
     */
    if (this._currentRoom === null) {
      this._rl.question('\nWhich user would you like to send a message to? ',
          (user) => {
            /**
             * Check that the user's choice of user is in the range of the user
             * array.
             */
            if (user < 1 || user > this._users_g.length) {
              console.log('\nInvalid user selection.\n');
              this.printPrompt();
              return;
            }

            /**
             * Get the content of the message to send.
             */
            this._rl.question('\nWhat is your message to ' + user + '? ',
                (message) => {
                  /**
                   * Send the id of the desired user and message body to the
                   * server for relaying to the desired user.
                   */

                  this._socket.emit('privateMessage', this._users_g[user - 1],
                      message, (ack) => {
                        console.log('\nMessage \"' + ack + '\" sent.\n');

                        /**
                         * Display option prompt again.
                         */
                        this.printPrompt();
                      });
                });
          });
    }

    /**
     * Send group message to everyone in the room that the user is currently in
     */
    else {
      /*
       * Get the content of the message to send.
       */
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