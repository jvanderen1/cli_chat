/*
 * CLI Chat
 * SE420 & SE310 Spring 2018 Group Project
 * Grant Savage, Josh Van Deren, Joy Tan, Jacob Lai
 * 
 * Updated: February 22. 2018 by Grant Savage
 *
 * index.js
 * 
 * This file serves as our client application. When run, 
 */

/*
 * Pull in the socket.io client package and instantiate a new
 * instance of it passing in the address of our socket server.
 * We also pull in the readline package that allows our app
 * to read input from standard in and interact with the command
 * line.
 */
var socket = require('socket.io-client')("http://107.170.245.203");
const readline = require('readline');

/*
 * Create the line reader interface and pass in standard input
 * and output as parameters. 
 */
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/*
 * Array to keep track of the current online users.
 */
var users_g = [];

/*
 * When our client connects log it and display the menu options.
 */
socket.on('connect', function() {
	console.log("App Connected!\nOptions:");
	console.log("\t1. List Current Online Users\n\t2. Send Message to User\n\t3. Exit App");
	getInput();
});

/*
 * When our client receives a users evet, set the users_g variable equal to the new array
 * of online users.
 */
socket.on('users', function(users) {
	users_g = users[0];
});

/*
 * When our client receives a new private message, display who it is from and the mssage body.
 */
socket.on('private message', (fromUser, message) => {
	console.log("\n\n\tNew Message from " + fromUser + "\n\tContent: " + message + "\n");

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
var getInput = function() {
	/*
	 * Get the user's menu option.
	 */
	rl.question('What would you like to do? ', (choice) => {
		/*
		 * If the user selected to display the list of online users,
		 * iterate over the array of users and display them to the console.
		 */
		if(choice == 1) {
			console.log("\nList of online users:\n");

			for (var i = 0; i < users_g.length; i++) {
				if (users_g[i] != socket.id)
					console.log(i+1 + ". " + users_g[i]);
			}

			console.log('\n');

			/*
			 * Ask for user input again.
			 */
			getInput();

		/*
		 * If the user chooses to send a user a message, ask what user to send to,
		 * ask what the message is, then send the message.
		 */
		} else if (choice == 2) {
			/*
			 * Get the id of the user to send the message to.
			 */
			rl.question('\nWhich user would you like to send a message to? ', (user) => {
				/*
				 * Check that the user's choice of user is in the range of the user
				 * array.
				 */
				if (user < 1 || user > users_g.length) {
					console.log("\nInvalid user selection.\n")
					getInput();
				}

				/*
				 * Get the content of the message to send.
				 */
				rl.question('\nWhat is your message to ' + user + '? ', (message) => {
					/*
					 * Send the id of the desired user and message body to the server
					 * for relaying to the desired user.
					 */
					socket.emit('private message', users_g[user -1], message, (ack) => {
						console.log('\nMessage \"' + ack + '\" sent.\n');
						/*
						 * Display option prompt again.
						 */
						getInput();
					});
				});
			});

		/*
		 * If the user chooses to quit the app, log it and exit the 
		 * program.
		 */
		} else if (choice == 3) {
			console.log("\nQuitting App...\n");
			process.exit(1);

		/*
		 * If the user does not enter a valid menu option log it
		 * and display the menu options again.
		 */
		} else {
			console.log("\nPlease choose a valid menu option.\n\n")
			console.log("\t1. List Current Online Users\n\t2. Send Message to User\n\t3. Exit App");

			/*
			 * Get desired menu option again.
			 */
			getInput();
		}
	});
}
