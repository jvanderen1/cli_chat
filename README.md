# CLI Chat
[![Build Status](https://travis-ci.org/jvanderen1/cli_chat.svg?branch=master)](https://travis-ci.org/jvanderen1/cli_chat)
[![Coverage Status](https://coveralls.io/repos/github/jvanderen1/cli_chat/badge.svg?branch=master&service=github)](https://coveralls.io/github/jvanderen1/cli_chat?branch=master&service=github)

## Introduction
This project is the culmination of work done by Joy Tan, Grant Savage, Joshua Van Deren, and Jacob Lai for the Spring 2018 classes of SE420 Software Quality Assurance and SE310 Software Analysis and Design at Embry-Riddle Aeronautical University. This project is an interactive command line chat. It uses the web socket protocol to send and receive messages from multiple users. Our client application and server implementation will allow clients to send private messages to each other and join rooms to group chat with other users. Our system will also allow users to block other users. This project is currently in development and bugs will be present. 

## Quick Start Installation
To install the required dependencies for both client and server run the install.sh shell script. You made need to change permissions on the file to run it. To do this run ```chmod 755 install.sh```.

## Running the System
In order to run the system and interact with it, a total of 3 terminal sessions (tabs) are needed. 1 to run the server and 1 to run 2 clients. Instructions on how to run on both the client and server are included in the README files under both the ```client``` and ```server``` directories under the ```src``` directory.

## Running Tests
Test are currentyl in development.
