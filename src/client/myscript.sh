#!/usr/bin/expect
# A Bash script to test the join room and leave room features

spawn ./index.js
expect "Nickname:"
send "Joy"
#expect "What would you like to do?"
#send "1"

# turn it back over to interactive user
interact