/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 22. 2018
 *
 * index.js
 * 
 * This file serves as our client application. When run,
 * this application connects to our backend server and allows
 * the realying of messages to other clients connected.
 */

/*
 * Pull in the socket.io client package and instantiate a new
 * instance of it passing in the address of our socket server.
 * We also pull in the readline package that allows our app
 * to read input from standard in and interact with the command
 * line.
 */
const socket = require('socket.io-client')('http://107.170.245.203');
const readline = require('readline');

/*
 * Create the line reader interface and pass in standard input
 * and output as parameters. 
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/*
 * Array to keep track of the current online users.
 */
let users_g = [];

/*
 * Organize options into separate number selection and prompt.
 */

let options = ['List Current Online Users', 'Send Message to User', 'Exit App'];
let options_num = [1, 2, 3];
let options_prompt = [
  'Options:', options_num.map(function(num, index) {
    return [num, options[index]].join('. ');
  }).join('\n'), ''].join('\n');

/*
 * When our client connects log it and display the menu options.
 */
socket.on('connect', () => {
  console.log('App Connected!\n');
  console.log(options_prompt);
  getInput();
});

/*
 * When our client receives a users evet, set the users_g variable equal to the new array
 * of online users.
 */
socket.on('users', (users) => {
  users_g = users[0];
});

/*
 * When our client receives a new private message, display who it is from and the mssage body.
 */
socket.on('private message', (fromUser, message) => {
  console.log('\n\n\tNew Message from ' + fromUser + '\n\tContent: ' + message +
      '\n');

  /*
   * Get user menu option choice.
   */
  getInput();
});

/*
 * Define out a function that asks the user what menu option they would like to choose.
 * Once the user has enterecd their desired option, determine which operation to perform
 * and perform the operation. The three main operations are: list current online users,
 * send a message to a online user, and quit the application.
 */
let getInput = function() {
  /*
   * Get the user's menu option.
   */
  rl.question('What would you like to do? ', (choice) => {
    /*
     * If the user selected to display the list of online users,
     * iterate over the array of users and display them to the console.
     */
    switch (+choice) {
      case 1:
        console.log('\nList of online users:\n');

        for (let i = 0; i < users_g.length; i++) {
          if (users_g[i] !== socket.id)
            console.log(i + 1 + '. ' + users_g[i]);
        }

        console.log('\n');

        /*
         * Ask for user input again.
         */
        getInput();
        break;

        /*
         * If the user chooses to send a user a message, ask what user to send to,
         * ask what the message is, then send the message.
         */

      case 2:
        /*
         * Get the id of the user to send the message to.
         */
        rl.question('\nWhich user would you like to send a message to? ',
            (user) => {
              /*
               * Check that the user's choice of user is in the range of the user
               * array.
               */
              if (user < 1 || user > users_g.length) {
                console.log('\nInvalid user selection.\n');
                getInput();
              }

              /*
               * Get the content of the message to send.
               */
              rl.question('\nWhat is your message to ' + user + '? ',
                  (message) => {
                    /*
                     * Send the id of the desired user and message body to the server
                     * for relaying to the desired user.
                     */
                    socket.emit('private message', users_g[user - 1], message,
                        (ack) => {
                          console.log('\nMessage \"' + ack + '\" sent.\n');
                          /*
                           * Display option prompt again.
                           */
                          getInput();
                        });
                  });
            });

        break;

        /*
         * If the user chooses to quit the app, log it and exit the
         * program.
         */
      case 3:
        console.log('\nQuitting App...\n');
        process.exit(1);
        break;

        /*
         * If the user does not enter a valid menu option log it
         * and display the menu options again.
         */
      default:
        console.log('\nPlease choose a valid menu option.\n');
        console.log(options_prompt);

        /*
         * Get desired menu option again.
         */
        getInput();
        break;
    }
  });
};
