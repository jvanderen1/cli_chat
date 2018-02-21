#ifndef CLI_CHAT_CLIENT_HPP
#define CLI_CHAT_CLIENT_HPP

#include <iostream>

class cli_client {
 public:
  cli_client(std::string IP);
  int createRoom();
  int selectRoom();
  int leaveRoom();

 private:
  std::string name;
  std::string color;
  int clientID;
};

#endif //CLI_CHAT_CLIENT_HPP
