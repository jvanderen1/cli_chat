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
    * Array to keep track of the current online users, their 
    * nicknames, the existing rooms, and the current room 
    * the user is in.
    */
    this._users_g = [];
    this._nicknames_g = [];
    this._rooms_g = [];
    this._currentRoom = null;

    /*
     * Set options available inside of Map object, where Map item = ( key, [title, function] ).
     */
    this._options_map = new Map();
    this._options_map.set(1, ['List Current Online Users', () => { this.listUsers(); }]);
    this._options_map.set(2, ['Join Room', () => { this.joinRoom(); }]);
    this._options_map.set(3, ['Leave Room', () => { this.leaveRoom(); }]);    
    this._options_map.set(4, ['Send Message to User', () => { this.sendMessage(); }]);
    this._options_map.set(5, ['Exit App', () => { this.exitApp(); }]);

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

    //this._socket.on('nickname', (nickname) => {
      //this._nicknames_g = this.nickname;
      //console.log('Testing123: ' + this._nicknames_g[0]);
      //});

    this._socket.on('rooms', (rooms) => {
      this._rooms_g = rooms[0];
    });
    
    /*
     * When our client connects log it and display the menu options.
     */
    this._socket.on('connect', () => {
      console.log('App Connected!\n');
      console.log('Current user ID: ' + this._socket.id);
      this.createNickname();
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
    console.log('\nOptions:\n');
    for (const [key, value] of this._options_map) {
      console.log([key, value[0]].join(': '));
    }
    console.log();
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

    if (this._users_g.length === 1) {
      console.log('No other users online.');
      console.log(this._users_g);
    }
    else {
      for (let i = 0; i < this._users_g.length; i++) {
        if (this._users_g[i] !== this._socket.id)
          console.log(i + 1 + '. ' + this._users_g[i]);
      }
    }

    /*
     * Ask for user input again.
     */
    this.getInput();
  }

/*******************************************************************************************/

  /*
   * Process user input for unique nicknames to replace this._socket.id (random array of
   * characters).
   */
  createNickname() {
  
    this._rl.question('Nickname: ',
      (nickname) => {
        /*
         * Check every element of the this._nicknames_g array to see if the nickname is
         * already taken by another user.
         */
        if (this._nicknames_g.indexOf(nickname) >= 0) {
          console.log('Nickname already taken. Try another.');
          createNickname();
        }
        else {
          this._nicknames_g = nickname;
          this.getInput();
        }
      });
  }

  /*
   * Ask the user if they want to create a room, name it, and automatically
   * put the user in the room.
   */
  createRoom() {
  
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
            this.getInput();
          });
        }
        else {
          this.getInput();
        }
      });  
  }

  /*
   * Let user choose a room to join and put them in that room
   */
  joinRoom() {
  
    /*
     * Prompt user to create room if there aren't any existing rooms.
     */
    if (this._rooms_g.length === 0) {
      console.log('\nNo existing rooms.');
      this.createRoom();
    }
    /*
     * User cannot join a room if already in a room.
     */
    else if (this._currentRoom !== null) {
      console.log('\nYou are already in room ' + this._currentRoom + '.');
      console.log('Leave your current room in order to join another.');
      this.getInput();
    }
    else {
      /*
       * Print every element of the this._rooms_g array to list the
       * existing rooms.
       */
      console.log('\nExisting rooms: ');
      for (let i = 0; i < this._rooms_g.length; i++) {
          console.log(this._rooms_g[i]);
      }
      /*
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
            this.getInput();
          }
          else if (room === 'NONE') {
            this.createRoom();     
            }
          else {
            console.log('\nInvalid room selection.');
            this.getInput();
          }
        });
      } 
  }
  
  
  /*
   * Pull the user out of a room if they are in one.
   */  
  leaveRoom() {
    if (this._currentRoom !== null) {
      this._socket.emit('leaveRoom', this.room, (roomName) => {
        console.log("Left room.");
      this._currentRoom = null;
      });
    }
    else
      console.log('\nYou are not currently in any rooms.');
    
    this.getInput();
  }

/*******************************************************************************************/

  /*
   * Method used to send a message to another specified user.
   */
  sendMessage() {

    if (this._users_g.length === 1) {
      console.log('\nThere are no other users to message.');
      this.getInput();
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
