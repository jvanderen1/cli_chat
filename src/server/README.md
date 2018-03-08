# CLI Chat Server

## Prerequisites
In order to run the server on your local machine, Node.js version 7.0.0 or higher is required. You can install Node.js with the information at [https://nodejs.org/en/]. Installing Node.js will also install NPM (Node Packaage Manager) which is required for installing dependencies. You can read more about NPM here: [https://www.npmjs.com/]

## Installation and Usage
To start the server on your local machine, cd into this 
directory ```/src/server``` and run
```
npm install
```
on the command line. This will install the required packages and modules in a node_modules folder
in the current directory. After this is complete, run
```
node index.js
```
to start the socket server, you will see some output and if all goes right you should see
```
Listening on port 3000 for connections...
```
This means the server is ready to receive web socket connections.
To test this out, open your web browser and type
```
http://localhost:3000
```
into the URL bar and hit enter.
If all goes right, you should see a dead simple web page that says "connected" at the top.
